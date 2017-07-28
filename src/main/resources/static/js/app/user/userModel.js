
function User(dataStorage) {
    BaseEntity.apply(this, arguments);
    this._entityName = 'user';

    this.username = "";
    this.password = "";
    this.mailAddress = "";
    this.role = [];
    this.enabled = true;

    Object.defineProperty(this, "representation", {
        enumerable: true,
        get: function () {
            return "" + this.username + " (" + this.description + ") ";
        }
    });
    this.role.representationList = function() {
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
    this.role.fillByTemplate = function(template) {
        this.length=0;
        var k=0;
        while (true) {
            if(k == template.length){
                break;
            }
            var entity = new Role(dataStorage);
            appUtils.fillValuesProperty(template[k], entity);
            this.push(entity);
            k = k+1;
        }
    }

}

function UserList(dataStorage){
    BaseEntityList.apply(this, arguments);
    this._entityName = 'user';
}

function Role(dataStorage) {
    BaseEntity.apply(this, arguments);
    this._entityName = 'role';

    this.role = "";

    Object.defineProperty(this, "representation", {
        enumerable: true,
        get: function () {
            return "" + this.role;
        }
    });
}

function RoleList(dataStorage){
    BaseEntityList.apply(this, arguments);
    this._entityName = 'role';
}
