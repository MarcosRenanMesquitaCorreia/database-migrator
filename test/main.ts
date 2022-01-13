import { assert } from "chai";

import { Migrator } from "../db-handlers/Migrator";
import { Filler } 	from "../db-handlers/Filler";

import { Config } from "../config/db_obj";
import json_users 		from "../config/users.json";
import json_stores 		from "../config/stores.json";
import json_purchases 	from "../config/purchases.json";

const users 		: any = Config.users;
const stores 		: any = Config.stores;
const purchases 	: any = Config.purchases;

const filler 	= new Filler(Config.mongo_conn);
const migrator 	= new Migrator(Config.mongo_conn, Config.mysql_conn);


describe("Database Filler Tests", function() {
	it("Fill MongoDB users collection", async function() {
		await filler.fillMongoCollection(json_users, users.name).catch(console.error);
		await migrator.getMongoCollection(users.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_users));
		});
	});
	
	it("Fill MongoDB stores collection", async function() {
		await filler.fillMongoCollection(json_stores, stores.name).catch(console.error);
		await migrator.getMongoCollection(stores.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_stores));
		});
	});
	
	it("Fill MongoDB purchases collection", async function() {
		let collection : any;
		await filler.fillMongoCollection(json_purchases, purchases.name).catch(console.error);
		await migrator.getMongoCollection(purchases.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_purchases));
		});
	});
});

describe("Migrator Tests", function() {
	var coll_users 		: any;
	var coll_stores 	: any;
	var coll_purchases 	: any;
	
	before("Collecting async collections from MongoDB", async function() {
		await migrator.getMongoCollection(users.name)		.then( (result) => {coll_users 		= result} );
		await migrator.getMongoCollection(stores.name)		.then( (result) => {coll_stores 	= result} );
		await migrator.getMongoCollection(purchases.name)	.then( (result) => {coll_purchases 	= result} );
		
		assert.isNotEmpty(coll_users);
		assert.isNotEmpty(coll_stores);
		assert.isNotEmpty(coll_purchases);
	});
	
	it("Migrating MongoDB users collection to MySQL table", function(done) {
		migrator.convertMongoToMysql(coll_users, users);
		migrator.getMysqlTable(users.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_users, null, 4));
			done();
		});
	});
	
	it("Migrating MongoDB stores collection to MySQL table", function(done) {
		migrator.convertMongoToMysql(coll_stores, stores);
		migrator.getMysqlTable(stores.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_stores, null, 4));
			done();
		});
	});
	
	it("Migrating MongoDB purchases collection to MySQL table", function(done) {
		migrator.convertMongoToMysql(coll_purchases, purchases);
		migrator.getMysqlTable(purchases.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_purchases, null, 4));
			done();
		});
	});
	
	after("Cleaning MongoDB and MySQL users collection", async function() {
        await migrator.delMongoCollection(users.name)	.catch(console.error);
        await migrator.delMongoCollection(stores.name)	.catch(console.error);
        await migrator.delMongoCollection(purchases.name).catch(console.error);
		
		await migrator.getMongoCollection(users.name)		.then( (result) => {coll_users 		= result} );
		await migrator.getMongoCollection(stores.name)		.then( (result) => {coll_stores 	= result} );
		await migrator.getMongoCollection(purchases.name)	.then( (result) => {coll_purchases 	= result} );
		
		migrator.delMysqlTable(users.name);
		migrator.delMysqlTable(stores.name);
		migrator.delMysqlTable(purchases.name);
		
		assert.isEmpty(coll_users);
		assert.isEmpty(coll_stores);
		assert.isEmpty(coll_purchases);
		
		migrator.closeMysqlConn();
    });
});