
function Task(dataStorage){
    BaseEntity.apply(this, arguments);
    this._entityName = 'task';

    this.date = "";
    this.title = "";
    this.author = new User(dataStorage);
    this.executor = [];
    this.project = new Project(dataStorage);
    this.state = "TODO";

    Object.defineProperty(this, "representation", {
        enumerable: true,
        get: function() {
            return "" + this.date + " /" + this.title + "/ (" + this.description + ") ";
        }
    });
    this.executor.representationList = function() {
            var str = "";
            var k=0;
            while (true) {
                if(k == this.length){
                    break;
                }
                str = str+"; "+this[k].representation;
                k = k+1;

            }
            return str;
    };
    this.executor.fillByTemplate = function(template) {
        this.length=0;
        var k=0;
        while (true) {
            if(k == template.length){
                break;
            }
            var entity = new User(dataStorage);
            appUtils.fillValuesProperty(template[k], entity);
            this.push(entity);
            k = k+1;
        }
    }
}

function TaskList(dataStorage){
    BaseEntityList.apply(this, arguments);
    this._entityName = 'task';
}
