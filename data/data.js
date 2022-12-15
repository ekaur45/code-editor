var __modes = {
    '.c':'text/x-c', // c language
    '.cpp':'text/x-c++src', // c++ 
    '.py':'text/x-python',
    'dockerfile':'markdown',
    '.yml':'text/x-yaml',
    '.go':'text/x-go',
    '.js':'text/javascript',
    '.ts':'application/typescript',
    '.swift':'text/x-swift',
    '.java':'text/x-java'
};
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
        let activeFileNam = this.activeProject.activeFiles.findIndex(x=>x == oldName);
        this.activeProject.activeFiles[activeFileNam] = newName;
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
        name:'test.py',
        content:`# Program to check if a number is prime or not

        num = 29
        
        # To take input from the user
        #num = int(input("Enter a number: "))
        
        # define a flag variable
        flag = False
        
        # prime numbers are greater than 1
        if num > 1:
            # check for factors
            for i in range(2, num):
                if (num % i) == 0:
                    # if factor is found, set flag to True
                    flag = True
                    # break out of loop
                    break
        
        # check if flag is True
        if flag:
            print(num, "is not a prime number")
        else:
            print(num, "is a prime number")`
    },
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