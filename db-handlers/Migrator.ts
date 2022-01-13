import * as mysql from "mysql";
import * as mongo from "mongodb";

import { logger } from "../logger/create-logger";


export class Migrator {
	private client_mongo : any
	private client_mysql : any
	private mongo_database	: any
	
	constructor(mongo_conn : any, mysql_conn : any)
	{
		this.client_mongo 		= new mongo.MongoClient(mongo_conn ["db_url"]);
		this.mongo_database 	= this.client_mongo.db(mongo_conn ["db_name"]);

		this.client_mysql = mysql.createConnection({
			host     : mysql_conn ["host"],
			user     : mysql_conn ["user"],
			password : mysql_conn ["pass"],
			database : mysql_conn ["db"],
			dateStrings: true
		});
		
		this.client_mysql.connect();
	}
	
	public async getMongoCollection(coll_name : string)	: Promise<JSON[]>
	{
		await this.client_mongo.connect();
		
		const collection : any 	= this.mongo_database.collection(coll_name);
		const document	 : any[]= await collection.find({}).toArray();
		
		await this.client_mongo.close();
				
		return JSON.parse(JSON.stringify(document));
	}
	
	public async delMongoCollection(coll_name : string) : Promise<void>
	{
		await this.client_mongo.connect();
		
		if ( !(await this.mongo_database.collection(coll_name).drop()) )
			logger.warn("collection '"+coll_name+"' does not exist");
		
		await this.client_mongo.close();
	}
	
	public getMysqlTable(table_name : string, returnTable : any) : void
	{
		let mysql_command = "SELECT * FROM " + table_name;
		
		this.client_mysql.query(mysql_command, function (error : String, result : any) {
			if (error) logger.error(error);
			logger.info("selecting all entries of table '"+table_name+"', result: \n" + JSON.stringify(result, null, 4));
			returnTable(result);
		});
	}
	
	public delMysqlTable(table_name : string) : void
	{
		let mysql_command = "DROP TABLE " + table_name;
		
		this.client_mysql.query(mysql_command, function (error : String, result : any) {
			if (error) logger.warn(error);
			logger.debug("dropping table '"+table_name+"', result: " + JSON.stringify(result));
		});
	}
	
	public convertMongoToMysql(coll : any[], coll_data : any) : void
	{
		let mysql_command : string;
		
		mysql_command = "CREATE TABLE "+coll_data.name+" (_id VARCHAR(100), "+coll_data.fields+")";
		this.client_mysql.query(mysql_command, function (error : String, result : any) {
			if (error) logger.error(error);
			logger.debug("initing table '"+coll_data.name+"', result: " + JSON.stringify(result));
		});
				
		mysql_command = "INSERT INTO "+coll_data.name+" SET ?";
		for (let entry of coll) {
			this.client_mysql.query(mysql_command, entry, function (error : String, result : any) {
				if (error) logger.error(error);
				logger.debug("inserting new entry in table '"+coll_data.name+"', entry: \n" + JSON.stringify(entry, null, 4));
				logger.debug("inserting collection entry in table '"+coll_data.name+"', result: " + JSON.stringify(result));
			});
		}
	}
	
	public closeMysqlConn() : void {
		this.client_mysql.end();
	}
}