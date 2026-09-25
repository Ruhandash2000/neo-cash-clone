//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-YwyYNcbU.js
var manifest = {
	"04d43b1cd407453775af6ced02c300b2399eff568b164d312d347b511aae64fe": {
		functionName: "verifyRegistration_createServerFn_handler",
		importer: () => import("./_ssr/webauthn.functions-CQNkfkZo.mjs")
	},
	"4471db3c21b6427956eb3ef20c9ec71159361a17721d611c0f20cb823d84a724": {
		functionName: "verifyAuthentication_createServerFn_handler",
		importer: () => import("./_ssr/webauthn.functions-CQNkfkZo.mjs")
	},
	"463c9c27919d708dba2c38828632ebd1a8339a7a196d4be0c09c901910d10664": {
		functionName: "listMyCredentials_createServerFn_handler",
		importer: () => import("./_ssr/webauthn.functions-CQNkfkZo.mjs")
	},
	"ad008b5beb0e3146d1f027ac462de652efffb5b8ed2bc6970c04e82d3a26b959": {
		functionName: "getRegistrationOptions_createServerFn_handler",
		importer: () => import("./_ssr/webauthn.functions-CQNkfkZo.mjs")
	},
	"cb5a48406579ee5876029687a8351eb9dd9f53848373200eb2d4a5fbbec5ee8c": {
		functionName: "getAuthenticationOptions_createServerFn_handler",
		importer: () => import("./_ssr/webauthn.functions-CQNkfkZo.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
