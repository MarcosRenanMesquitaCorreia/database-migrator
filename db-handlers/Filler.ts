import * as mongo from "mongodb";
import { logger } from "../logger/create-logger";

export class Filler {
	private client_mongo 	: any
	private mongo_database	: any

	constructor(mongo_conn : any) {
		this.client_mongo 		= new mongo.MongoClient(mongo_conn ["db_url"]);
		this.mongo_database 	= this.client_mongo.db(mongo_conn ["db_name"]);
	}
	
	public async fillMongoCollection(entries : any, coll_name : string) : Promise<void>
	{
		let date : any = new Date().toISOString().slice(0, 19).replace('T', ' ');
		await this.client_mongo.connect();
		
		const collection : any 	= this.mongo_database.collection(coll_name);
		for (let entry of entries) {
			entry ["created"] = date;
			entry ["updated"] = date;
		}
		await collection.insertMany(entries);
		
		logger.info("entries inserted in MongoDB collection '"+coll_name+"': \n" + JSON.stringify(entries, null, 4));
		
		await this.client_mongo.close();
	}	
}