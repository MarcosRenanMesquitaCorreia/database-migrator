# Database Migrator

## Overview
The **Database Migrator** APP is responsible for handling and migrate a non-relational
database from MongoDB to a MySQL relational database.

This is NOT a continuous running app, it's just for test.

The 'index.ts' is just a simple presentation, to see real results run 'npm run test'.

Also check '/log/main.log' file.

Basically, there is three main scripts about this application, Filler.ts, Migrator.ts and Helper.ts.


	## Filler
	Filler class is a instance used to fill a MongoDB colection with a .JSON entry.

		# constructor
		Initiate Mongo client receiving a object containing	the proper connection config.
		/** 
		*	mongo_conn : any = {
		*			db_url 	: string (mongo database url)
		*			db_name : string (mongo database name)
		*		}
		*/
		
		# getMongoClient
		Return mongo client.
		/** 
		*	
		*/
		
		# getMongoDatabase
		Return mongo database.
		/** 
		*	
		*/

		# fillMongoCollection
		It will save in MongoDB the JSON entries, just updating the fields
		'created' and 'updated'.
		/** 
		*	entries 	: any 	(JSON with entries for MongoDB collection)
		*	coll_name 	: string(MongoDB collection name)
		*/


	## Migrator
	Migrator class contains the principle of the app, the migration of a collection to a table.
		
		# constructor
		Initiate MySQL client receiving a object containing	the proper connection config.
		/** 
		*	mysql_conn : any = {
		*			host : string (mysql host url)
		*			user : string (mysql user name)
		*			pass : string (mysql password)
		*			db 	 : string (mysql database name)
		*		}
		*/
	
		# getMysqlClient
		Return MySQL client.
		/** 
		*	
		*/
	
		# migrateMongoToMysql
		Copy a Mongo collection to a MySQL table
		/** 
		*	coll 		: any 		(MongoDB collection to be migrated)
		*	coll_data 	: any = {	(MongoDB collection data for migration)
		*					name 	: string (name of collection)
		*					fields 	: string 
		*					(fields of collection translated
		*					for MySQL insert format. EX: 
		*					"name VARCHAR(100), created TIMESTAMP, updated TIMESTAMP")
		*				}
		*/
		
		
	## Helper
		Helper is responsible to access and delete data inside MySQL and MongoDB.
		
		The correct way to use it is passing a Migrator and Filler respective clients
		to not run two different clients in different instances, causing asynchronous
		issues.
		
		# constructor
		Initiate Mongo client and MySQL client with Filler and Migrator instances.
		
		If not inserted none, can be setted wit 'setMongoClient', 'setMongoDatabase'
		and 'setMysqlClient'.
		/** 
		*	filler? 	: Filler (Filler instance)
		*	migrator? 	: Migrator (Migrator instance)
		*/
		
		# setMongoClient
		Set in Helper object a new Mongo client.
		/** 
		*	mongo_client : MongoClient (MongoDB client)
		*/
		
		# setMongoDatabase
		Set in Helper object a new Mongo database.
		/** 
		*	mongo_database : any (MongoDB database)
		*/
		
		# setMysqlClient
		Set in Helper object a new Mongo client.
		/** 
		*	mysql_client : any (MySQL client)
		*/
	
		# getMongoCollection
		Return a specified collection from MongoDB through a Promise.
		/** 
		*	coll_name : string (MongoDB collection name)
		*/
	
		# delMongoCollection
		Delete a specified collection from MongoDB.
		/** 
		*	coll_name : string (MongoDB collection name)
		*/
	
		# getMysqlTable
		Return a specified table from MySQL through a CallBack.
		/** 
		*	table_name 	: string (MySQL table name)
		*	returnTable	: call back method
		*/
	
		# delMysqlTable
		Delete a specified table from MySQL.
		/** 
		*	table_name : string (MySQL table name)
		*/
