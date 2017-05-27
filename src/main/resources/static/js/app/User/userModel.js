
function User(dataStorage) {
    BaseEntity.apply(this, arguments);
    this._entityName = 'user';

    this.name = "";
    this.password = "";

    Object.defineProperty(this, "representation", {
        enumerable: true,
        get: function () {
            return "" + this.name + " (" + this.description + ") ";
        }
    });

}

function UserList(dataStorage){
    BaseEntityList.apply(this, arguments);
    this._entityName = 'user';
}