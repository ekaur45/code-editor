__editorConfig.addProject({name:"Project1"});
__editorConfig.setCurrentProject("Project1");
__editorConfig.addFile("File.js");
__editorConfig.addFile("index.js");
__editorConfig.addActiveFile("File.js");
__editorConfig.addActiveFile("index.js");
//#region  variabled
var activeTab = __editorConfig.activeProject.files[0].name;
var codeeditor = null;
var modal2 = document.getElementById("remove-f");
//#endregion
$(document).ready(__init);
function __init() {
    __restrictions();
    initResizableLayout();
    $('#language').multiSelect();
    $('#sanitise').multiSelect();
    $("#accordion").accordion({
        collapsible: true
    });
    initCodeEditor1();
    initializeCodeEditor2();
    listeners();
    RenderProjects();
    RenderFileList();
    RenderTabs();
}
function __restrictions() {
    $(document).on('change keyup', '.required', function (e) {
        let Disabled = true;
        $(".required").each(function () {
            let value = this.value
            if ((value) && (value.trim() != '')) {
                Disabled = false
            } else {
                Disabled = true
                return false
            }
        });

        if (Disabled) {
            $('.toggle-disabled').prop("disabled", true);
        } else {
            $('.toggle-disabled').prop("disabled", false);
        }
    })
}
function initResizableLayout() {
    $(".code-left").resizable({
        handles: 'e',
        resize: function (event, ui) {
            var width = $(ui.element).width();
            document.getElementById('code-right-container').style = `width:calc(82% - ${width}px) !important;`;
            //console.log({event,ui});
        }
    });
    $("#code-all-container").resizable({
        handles: 's',
        resize: function (event, ui) {
            var height = $(ui.element).height();
            height += 59;
            document.getElementById('python-area-container').style = `height:calc(100vh - ${height}px) !important;`;
            //console.log({event,ui});
        }
    });
}
function createCodeMirror(content) {
    codeeditor.setValue(content);
}
function initCodeEditor1() {
    codeeditor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: {
            name: "markdown",
            highlightFormatting: true
        },
        lineNumbers: true,
        theme: "default",
        extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
    });
}


function AddFileClickListener() {
    let activeFiles = __editorConfig.getActiveFiles();
    $('.file_list').on('click', function () {
        activeTab = $(this).data("file_name");
        if (activeFiles.filter(x => x === activeTab).length < 1)
            activeFiles.push(activeTab);
        RenderFileList();
        RenderTabs();
    });
    $('.file-fa-xmark').on('click', function () {
        var parent = $(this).parent();
        let index = activeFiles.findIndex(x => x === $(parent).data("file_name"));//activeFiles.indexOf(x=>x===$(parent).data("file_name"));
        activeFiles.splice(index, 1);
        activeTab = activeFiles[0];
        RenderFileList();
        RenderTabs();
    });
}
function RenderTabs() {
    let activeFiles = __editorConfig.getActiveFiles();
    if (activeFiles && activeFiles.length > 0) {
        var html = "";
        for (let i = 0; i < activeFiles.length; i++) {
            var isActive = activeFiles[i] === activeTab;
            html += `<a href="#" data-file_name='${activeFiles[i]}' ${isActive ? 'class="active file_list"' : 'class="file_list"'}><i class="fa-solid fa-file-code"></i><span>${activeFiles[i]}</span>${true ? '<i class="fa-sharp fa-solid fa-xmark file-fa-xmark" ></i>' : ''}</a>`
        }
        var activeTabFile = __editorConfig.activeProject.files.filter(x => x.name === activeTab);
        if (activeTabFile) {
            createCodeMirror(activeTabFile[0].content)
        }
        $("#files-name").html(html);
        AddFileClickListener();
    } else {
        var html = "";
        createCodeMirror("")
        $("#files-name").html(html);
    }
}
function RenderFileList() {
    let files = __editorConfig.getFiles();
    var html = "";
    if (!(files && files.length)) {
        var html = "";
        createCodeMirror()
        $("#file-list").html(html);
        return
    }
    for (let i = 0; i < files.length; i++) {
        var isActive = files[i].name === activeTab;
        html += `<li><a href="#" data-file_name='${files[i].name}' ${isActive ? 'class="active file_list"' : 'class="file_list"'}><i class="fa-solid fa-file-code"></i> ${files[i].name} ${isActive ? '<i class="fa-solid fa-xmark remove-file" id="remove"></i>' : ''}</a></li>`
    }
    $("#file-list").html(html);
    AddFileClickListener();
  
}
function RenderProjects(){
    let projects = __editorConfig.projects;
    var html = "";
    if (!(projects && projects.length)) {
        var html = "";
        createCodeMirror()
        $("#project-list").html(html);
        return
    }
    for (let i = 0; i < projects.length; i++) {
        var isActive = projects[i].name === __editorConfig.activePName;
        html += `<li><a href="#" data-file_name='${projects[i].name}' ${isActive ? 'class="active file_list"' : 'class="file_list"'}><i class="fa-solid fa-file-code"></i> ${projects[i].name} ${isActive ? '<i class="fa-solid fa-xmark remove-file" id="remove"></i>' : ''}</a></li>`
    }
    $("#project-list").html(html);
    AddFileClickListener();
}


function initializeCodeEditor2() {
    var editor = CodeMirror.fromTextArea(document.getElementById("code-right"), {
        mode: {
            name: "python",
            highlightFormatting: true
        },
        lineNumbers: false,
        theme: "default",
        extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
    });
}

function confirmDialog() {
    return new Promise((resolve, reject) => {
        $("#remove-f").show();
        var span3 = document.getElementsByClassName("close3")[0];
        $(".close2").on('click', function () {
            $("#remove-f").hide();
            resolve(false)
        })
        $(".close3").on('click', function () {
            $("#remove-f").hide();
            resolve(true);
        })
        window.onclick = function (event) {
            if (event.target == modal2) {
                $("#remove-f").hide();
                resolve(false);
            }
        }
    });
}

function myFunction() {
    var element = document.querySelector('.lightmode');
    element.classList.toggle("dark-mode");
}
function listeners() {
    $(".dark").click(function () {
        $(".dark").addClass("active");
        $(".light").removeClass("active");
    });

    $(".light").click(function () {
        $(".light").addClass("active");
        $(".dark").removeClass("active");
    });
    $("#file-list").on('click', function (e) {
        if (e.target.classList.contains('remove-file')) {
            var _this = e.target;
            $("#deleting-file-name").text($(_this).parent().data('file_name'));
            confirmDialog().then(x => {
                if (x === true) {
                    let _fileName = $(_this).parent().data('file_name');
                    let _files = files.filter(x => x.name == _fileName);
                    if (_files.length > 0) {
                        files.splice(files.findIndex(x => x.name == _files[0].name), 1);
                        let index = activeFiles.findIndex(x => x === _files[0].name);//activeFiles.indexOf(x=>x===$(parent).data("file_name"));
                        activeFiles.splice(index, 1);
                        activeTab = activeFiles[0];
                        RenderTabs();
                        RenderFileList();
                    }
                }
            })
        }
    })
    $("#myBtn").on("click",function(){
        $("#myModal").show();
    });
    $("#addFileBtn").on("click",function(){
        $("#add-f").show();
    });
    $("#add-file-confirm-btn").on("click",function(){
        if($("#add-file-name").val())
        {
            __editorConfig.addFile($("#add-file-name").val());
            __editorConfig.addActiveFile($("#add-file-name").val());
            $("#add-f").hide();
        }
    });
    $("#createFileForm").on("submit",function(e){
        e.preventDefault();
        var __fileConfig=$(e.target).serializeArray();
        var fileName = __fileConfig.filter(x=>x.name == "name")[0];
        __editorConfig.addProject(fileName.value);
        
        // files.push({name:fileName.value,content:"/* new file*/"})
        // activeFiles.push(fileName.value);
        // activeTab = fileName.value;
        RenderFileList();
        RenderTabs();
        $("#myModal").hide();
    });
}