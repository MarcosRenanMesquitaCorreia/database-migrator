import * as mysql from "mysql";

import { logger } from "../logger/create-logger";


export class Migrator {
	private mysql_client : any
	
	constructor(mysql_conn : any)
	{
		this.mysql_client = mysql.createConnection({
			host     : mysql_conn ["host"],
			user     : mysql_conn ["user"],
			password : mysql_conn ["pass"],
			database : mysql_conn ["db"],
			dateStrings: true
		});
		
		this.mysql_client.connect();
	}
	
	public getMysqlClient() : any {
		return this.mysql_client;
	}
	
		
	public closeMysqlConn() : void {
		this.mysql_client.end();
	}
	
	public migrateMongoToMysql(coll : any[], coll_data : any) : void
	{
		let mysql_command : string;
		
		mysql_command = "CREATE TABLE "+coll_data.name+" (_id VARCHAR(100), "+coll_data.fields+")";
		this.mysql_client.query(mysql_command, function (error : String, result : any) {
			if (error) logger.error(error);
			logger.debug("initing table '"+coll_data.name+"', result: " + JSON.stringify(result));
		});
				
		mysql_command = "INSERT INTO "+coll_data.name+" SET ?";
		for (let entry of coll) {
			this.mysql_client.query(mysql_command, entry, function (error : String, result : any) {
				if (error) logger.error(error);
				logger.debug("inserting new entry in table '"+coll_data.name+"', entry: \n" + JSON.stringify(entry, null, 4));
				logger.debug("inserting collection entry in table '"+coll_data.name+"', result: " + JSON.stringify(result));
			});
		}
	}
}