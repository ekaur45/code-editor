var __editorConfig = {
    projects:[],
    activePName:"",
    activeProject:{},
    /**
     * 
     * @param {{name:String,files:Array}} project 
     */
    addProject:function(project){
        const {name} = project;
        this.projects.push({name,files:[]});        
    },
    /**
     * 
     * @param {string} name 
     */
    setCurrentProject:function(name){
        let _project = this.projects.filter(x=>x.name == name);
        this.activePName = _project[0].name;
        this.activeProject = _project[0];
    },
    addFile:function(name,content=""){
        this.activeProject.files.push({name,content});
    },
    /**
     * 
     * @returns 
     */
    getFiles:function(){
        return this.activeProject.files;
    },
    getActiveFiles:function(){
        return this.activeProject.activeFiles;
    },
    addActiveFile:function(fileName){
        if(!(this.activeProject.activeFiles)) this.activeProject.activeFiles = [];
        this.activeProject.activeFiles.push(fileName)
    },
    renameFile:function(oldName,newName){
        let _project = this.activeProject.files.filter(x=>x.name == oldName);
        _project[0].name = newName;
    },
    setContent:function(name,content){
        let __a = this.activeProject.files.filter(x=>x.name == name);
        if(__a&&__a.length>0)
            __a[0].content = content;
    },
    deleteFile:function(name){
        
        let index = this.activeProject.files.findIndex(x=>x.name == name);
        this.activeProject.files.splice(index,1);
        let index1 = this.activeProject.activeFiles.findIndex(x=>x == name);
        this.activeProject.activeFiles.splice(index1,1);

    }

}


var files = [
    {
        name:"Dockerfile",
        content:"# The Docker file"
    },
    {
        name:"build.sh",
        content:"pip3 install .\nfor fuzzer in $(find $SRC -name 'fuzz_*.py'); do\ncompile_python_fuzzer $fuzzer\ndone"
    },
    {
        name:"project.yaml",
        content:"# The yml file"
    },
    {
        name:"fuzz.cc",
        content:"# the fuzz cc file"
    }
]
var activeFiles = ["build.sh","Dockerfile"];