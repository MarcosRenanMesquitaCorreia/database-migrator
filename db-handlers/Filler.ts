import * as mongo from "mongodb";
import { logger } from "../logger/create-logger";

export class Filler {
	private mongo_client 	: mongo.MongoClient
	private mongo_database	: any

	constructor(mongo_conn : any) {
		this.mongo_client 		= new mongo.MongoClient(mongo_conn ["db_url"]);
		this.mongo_database 	= this.mongo_client.db(mongo_conn ["db_name"]);
	}
	
	public getMongoClient() : mongo.MongoClient {
		return this.mongo_client;
	}
	
	public getMongoDatabase() : any {
		return this.mongo_database;
	}
	
	public async fillMongoCollection(entries : any, coll_name : string) : Promise<void>
	{
		let date : any = new Date().toISOString().slice(0, 19).replace('T', ' ');
		await this.mongo_client.connect();
		
		const collection : any 	= this.mongo_database.collection(coll_name);
		for (let entry of entries) {
			entry ["created"] = date;
			entry ["updated"] = date;
		}
		await collection.insertMany(entries);
		
		logger.info("entries inserted in MongoDB collection '"+coll_name+"': \n" + JSON.stringify(entries, null, 4));
		
		await this.mongo_client.close();
	}	
}