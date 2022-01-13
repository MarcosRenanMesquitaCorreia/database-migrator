import * as mysql from "mysql";
import * as mongo from "mongodb";

import { Migrator } from "./Migrator";
import { Filler } 	from "./Filler";

import { logger } from "../logger/create-logger";


export class Helper {
	private mongo_client 	: mongo.MongoClient
	private mysql_client 	: any
	private mongo_database	: any

	
	constructor(filler? : Filler, migrator? : Migrator)
	{		
		if (migrator)
			this.setMysqlClient(migrator.getMysqlClient());
		
		if (filler) {
			this.setMongoClient(filler.getMongoClient());
			this.setMongoDatabase(filler.getMongoDatabase());
		}
	}
	
	public setMongoClient(mongo_client : mongo.MongoClient) : void {
		this.mongo_client = mongo_client;
	}
	
	public setMongoDatabase(mongo_database : any) : void {
		this.mongo_database = mongo_database;
	}
	
	public setMysqlClient(mysql_client : any) : void {
		this.mysql_client = mysql_client;
	}	
	
	public async getMongoCollection(coll_name : string)	: Promise<JSON[]>
	{
		await this.mongo_client.connect();
		
		const collection : any 	= this.mongo_database.collection(coll_name);
		const document	 : any[]= await collection.find({}).toArray();
		
		await this.mongo_client.close();
				
		return JSON.parse(JSON.stringify(document));
	}
	
	public async delMongoCollection(coll_name : string) : Promise<void>
	{
		await this.mongo_client.connect();
		
		if ( !(await this.mongo_database.collection(coll_name).drop()) )
			logger.warn("collection '"+coll_name+"' does not exist");
		
		await this.mongo_client.close();
	}
	
	public getMysqlTable(table_name : string, returnTable : any) : void
	{
		let mysql_command = "SELECT * FROM " + table_name;
		
		this.mysql_client.query(mysql_command, function (error : String, result : any) {
			if (error) logger.warn(error);
			logger.info("selecting all entries of table '"+table_name+"', result: \n" + JSON.stringify(result, null, 4));
			returnTable(result);
		});
	}
	
	public delMysqlTable(table_name : string) : void
	{
		let mysql_command = "DROP TABLE " + table_name;
		
		this.mysql_client.query(mysql_command, function (error : String, result : any) {
			if (error) logger.warn(error);
			logger.debug("dropping table '"+table_name+"', result: " + JSON.stringify(result));
		});
	}
	
	public closeMysqlConn() : void {
		this.mysql_client.end();
	}
}