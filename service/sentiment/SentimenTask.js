const _ = require('lodash');
class SentimenTask {
	constructor(config){
		this.config = config;
	}
	
	getInstance() {
		if(!this.taskIntance) {
		    const taskClass = _.get(require(this.config.fileName), this.config.className);
		    this.taskIntance = new taskClass(this.config.config);				
		}
		return this.taskIntance;
	}
	
	apply(messages = []){
		const taskIntance = this.getInstance();
		return taskIntance[this.config.methodName](messages);
	}
}

module.exports.SentimenTask = SentimenTask;