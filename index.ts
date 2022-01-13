import { Migrator } from "../db-handlers/Migrator";
import { Filler } 	from "../db-handlers/Filler";
import { Helper } 	from "../db-handlers/Helper";

import json_users from "../config/users.json";
import { Config } from "../config/db_obj";

import { logger } from "./logger/create-logger";


const users : any = Config.users;

const migrator 	= new Migrator(Config.mongo_conn, Config.mysql_conn);
const filler 	= new Filler(Config.mongo_conn);
const helper 	= new Helper(filler, migrator);


(async () => {
	logger.warn("just for test, this is not an executable application yet!");
	await filler.fillMongoCollection(json_users, users.name).catch(console.error);
	await helper.getMongoCollection(users.name).then( (result) => {
		helper.convertMongoToMysql(result, users);
		helper.getMysqlTable(users.name, (table : any) => {
			logger.warn("check the results in /log/main.log");
		});
	});
	await helper.delMongoCollection(users.name).catch(console.error);
	helper.delMysqlTable(users.name);
})();