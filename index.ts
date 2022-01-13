import { Migrator } from "../db-handlers/Migrator";
import { Filler } 	from "../db-handlers/Filler";

import json_users from "../config/users.json";
import { Config } from "../config/db_obj";

import { logger } from "./logger/create-logger";


const users : any = Config.users;

const filler 	= new Filler(Config.mongo_conn);
const migrator 	= new Migrator(Config.mongo_conn, Config.mysql_conn);

(async () => {
	logger.warn("just for test, this is not an executable application yet!");
	await filler.fillMongoCollection(json_users, users.name).catch(console.error);
	await migrator.getMongoCollection(users.name).then( (result) => {
		migrator.convertMongoToMysql(result, users);
		migrator.getMysqlTable(users.name, (table : any) => {
			logger.warn("check the results in /log/main.log");
		});
	});
	await migrator.deleteMongoCollection(users.name).catch(console.error);
	migrator.deleteMysqlTable(users.name);
})();