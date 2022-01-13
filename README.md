# Database Migrator

## Overview
The **Database Migrator** APP is responsible for handling and migrate a non-relational
database from MongoDB to a MySQL relational database.

This is NOT a continuous running app, it's just for test.

The 'index.ts' is just a simple presentation, to see real results run 'npm run test'.

Also check '/log/main.log' file.

Basically, there is two main scripts about this application, Filler.ts and Migrator.ts.


	# Filler
	Filler class is a instance used to fill a MongoDB colection with a .JSON entry.

		# constructor
		Initiate mongo client receiving a object containing	the proper connection config.
		
		/** 
		*	mongo_conn : any = {
		*			db_url 	: string (mongo database url)
		*			db_name : string (mongo database name)
		*		}
		*/
		

		# fillMongoCollection
		This is the only method in class besides your own constructor.
		
		It will save in MongoDB the JSON entries, just updating the fields
		'created' and 'updated'.
		
		/** 
		*	entries 	: any 	(JSON with entries for MongoDB collection)
		*	coll_name 	: string(MongoDB collection name)
		*/


	# Migrator
	Migrator class contains the principle of the app. It is responsible to access and delete
	data inside MySQL and MongoDB. Besides, it does the migration of a collection to a table.
	
	
		# getMongoCollection
		Return a specified collection from MongoDB through a Promise.
		
		/** 
		*	coll_name : string (MongoDB collection name)
		*/
	
		# deleteMongoCollection
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
	
		# deleteMysqlTable
		Delete a specified table from MySQL.
		
		/** 
		*	table_name : string (MySQL table name)
		*/
	
		# convertMongoToMysql
		Copy a MongoDB collection to a MySQL table
		
		/** 
		*	coll 		: any 		(MongoDB collection to be migrated)
		*	coll_data 	: any = {	(MongoDB collection data for migration)
		*					name 	: string (name of collection)
		*					fields 	: string (fields of collection translated
		*									for MySQL insert format. EX: 
		*									"name VARCHAR(100), created TIMESTAMP, updated TIMESTAMP")
		*				}
		*/