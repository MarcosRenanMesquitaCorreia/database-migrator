import { assert } from "chai";

import { Migrator } from "../db-handlers/Migrator";
import { Filler } 	from "../db-handlers/Filler";
import { Helper } 	from "../db-handlers/Helper";

import { Config } 	from "../config/db_obj";
import json_users 		from "../config/users.json";
import json_stores 		from "../config/stores.json";
import json_purchases 	from "../config/purchases.json";


const users 		: any = Config.users;
const stores 		: any = Config.stores;
const purchases 	: any = Config.purchases;

const migrator 	= new Migrator(Config.mysql_conn);
const filler 	= new Filler(Config.mongo_conn);
const helper 	= new Helper(filler, migrator);

var coll_users 		: any;
var coll_stores 	: any;
var coll_purchases 	: any;


describe("Database Filler Tests", function() {
	it("Fill MongoDB users collection", async function() {
		await filler.fillMongoCollection(json_users, users.name).catch(console.error);
		await helper.getMongoCollection(users.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_users));
		});
	});
	
	it("Fill MongoDB stores collection", async function() {
		await filler.fillMongoCollection(json_stores, stores.name).catch(console.error);
		await helper.getMongoCollection(stores.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_stores));
		});
	});
	
	it("Fill MongoDB purchases collection", async function() {
		let collection : any;
		await filler.fillMongoCollection(json_purchases, purchases.name).catch(console.error);
		await helper.getMongoCollection(purchases.name).then( (result) => {
			assert.equal(JSON.stringify(result), JSON.stringify(json_purchases));
		});
	});
});

describe("Database Migrator Tests", function() {	
	before("Collecting async collections from MongoDB", async function() {
		await helper.getMongoCollection(users.name)		.then( (result) => {coll_users 		= result} );
		await helper.getMongoCollection(stores.name)		.then( (result) => {coll_stores 	= result} );
		await helper.getMongoCollection(purchases.name)	.then( (result) => {coll_purchases 	= result} );
		
		assert.isNotEmpty(coll_users);
		assert.isNotEmpty(coll_stores);
		assert.isNotEmpty(coll_purchases);
	});
	
	it("Migrating MongoDB users collection to MySQL table", function(done) {
		migrator.migrateMongoToMysql(coll_users, users);
		helper.getMysqlTable(users.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_users, null, 4));
			done();
		});
	});
	
	it("Migrating MongoDB stores collection to MySQL table", function(done) {
		migrator.migrateMongoToMysql(coll_stores, stores);
		helper.getMysqlTable(stores.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_stores, null, 4));
			done();
		});
	});
	
	it("Migrating MongoDB purchases collection to MySQL table", function(done) {
		migrator.migrateMongoToMysql(coll_purchases, purchases);
		helper.getMysqlTable(purchases.name, (table : any) => {
			assert.equal(JSON.stringify(table, null, 4), JSON.stringify(coll_purchases, null, 4));
			done();
		});
	});
});

describe("Deinit MongoDB and MySQL databases", function() {
	it("Deleting MongoDB collections", async function() {
		await helper.delMongoCollection(users.name)		.catch(console.error);
        await helper.delMongoCollection(stores.name)	.catch(console.error);
        await helper.delMongoCollection(purchases.name)	.catch(console.error);
		
		await helper.getMongoCollection(users.name)		.then( (result) => {coll_users 		= result} );
		await helper.getMongoCollection(stores.name)	.then( (result) => {coll_stores 	= result} );
		await helper.getMongoCollection(purchases.name)	.then( (result) => {coll_purchases 	= result} );
		
		assert.isEmpty(coll_users);
		assert.isEmpty(coll_stores);
		assert.isEmpty(coll_purchases);
	});
	
	it("Deleting MySQL tables", function(done) {
		helper.delMysqlTable(users.name);
		helper.delMysqlTable(stores.name);
		helper.delMysqlTable(purchases.name);
		
		helper.getMysqlTable(users.name, (table : any) => {
			assert.notExists(table);
		});
		helper.getMysqlTable(stores.name, (table : any) => {
			assert.notExists(table);
		});
		helper.getMysqlTable(purchases.name, (table : any) => {
			assert.notExists(table);
			helper.closeMysqlConn();
			done();
		});
	});
});