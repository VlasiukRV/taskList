
function Project(dataStorage){
    BaseEntity.apply(this, arguments);
    this._entityName = 'project';

    this.name = "";

    Object.defineProperty(this, "representation", {
        enumerable: true,
        get: function () {
            return "" + this.name;
        }
    });

}

function ProjectList(dataStorage){
    BaseEntityList.apply(this, arguments);
    this._entityName = 'project';
}
