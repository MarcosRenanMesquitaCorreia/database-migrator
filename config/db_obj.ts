import * as dotenv 	from "dotenv";

dotenv.config({path:"./config/db_conn.env"});

export class Config {
	public static readonly mongo_conn : any = {
		"db_url" : process.env.MONGO_DB_CONN_STRING,
		"db_name": process.env.MONGO_DB_NAME
	}
	public static readonly mysql_conn : any = {
		"host": process.env.MYSQL_HOST,
		"user": process.env.MYSQL_USER,
		"pass": process.env.MYSQL_PASSWORD,
		"db"  : process.env.MYSQL_DATABASE
	}
	public static readonly users : any = {
		"name" 	: process.env.USERS_TABLE_NAME,
		"fields": process.env.USERS_TABLE_FIELDS
	}
	public static readonly stores : any = {
		"name" 	: process.env.STORES_TABLE_NAME,
		"fields": process.env.STORES_TABLE_FIELDS
	}
	public static readonly purchases : any = {
		"name" 	: process.env.PURCHASES_TABLE_NAME,
		"fields": process.env.PURCHASES_TABLE_FIELDS
	}
}
