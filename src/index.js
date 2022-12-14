let ff = ["test.py", "Dockerfile", "build.sh", "project.yaml", "fuzz.cc"];
__editorConfig.addProject({ name: "Project1" });
__editorConfig.setCurrentProject("Project1");
ff.forEach(x => {
    __editorConfig.addFile(x, `# ${x} file content`);
})
__editorConfig.addActiveFile(ff[0]);
//#region  variabled
var activeTab = __editorConfig.activeProject.files[0].name;
var codeeditor = null;
var modal2 = document.getElementById("remove-f");
var contextMenuOptions = {
    foo: {
        name: "Rename", callback: function (key, opt) {
            let fileName = $(opt.$trigger).children().data("file_name");
            openRenameDialog(fileName).then((x) => {
                if (x.success == true) {
                    __editorConfig.renameFile(fileName, x.name);
                    if (fileName == activeTab) activeTab = x.name;
                    RenderFileList();
                    RenderTabs();
                }
            })
        }
    },
    bar: {
        name: "Delete", callback: function (key, opt) {
            let fileName = $(opt.$trigger).children().data("file_name");
            console.log({ fileName });
            openDeleteConfirmDialog(fileName).then(x => {
                if (x == true) {
                    __editorConfig.deleteFile(fileName);
                    if (fileName == activeTab) {
                        if (__editorConfig.activeProject.files && __editorConfig.activeProject.files.length > 0)
                            activeTab = __editorConfig.activeProject.files[0].name
                    }
                    RenderTabs();
                    RenderFileList();
                }
            })
        }
    }
}

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
function __initContextMenu() {

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#file-list li",
        // define the elements of the menu
        items: contextMenuOptions
        // there's more, have a look at the demos and docs...
    });
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
    // $(window).on('resize', function (e) {
    //     if (e.target == window) {
    //         if (screen.availWidth == window.innerWidth) {
    //             $(".code-left").removeAttr("style");
    //             $(".code-right").removeAttr("style");
    //             $(".code-left").resizable("destroy");
    //             $("#code-all-container").resizable("destroy");
    //             $(".code-left").css({ "width": "48%" });
    //             $(".code-right").css({ "width": "40%" });
    //             $(".code-left").resizable({
    //                 handles: 'e',
    //                 resize: function (event, ui) {
    //                     var width = $(ui.element).width();
    //                     document.getElementById('code-right-container').style = `width:calc(calc(100% - 353px)% - ${width}px) !important;`;
    //                     //console.log({event,ui});
    //                 }
    //             });
    //             $("#code-all-container").resizable({
    //                 handles: 's',
    //                 resize: function (event, ui) {
    //                     var height = $(ui.element).height();
    //                     height += 59;
    //                     document.getElementById('python-area-container').style = `height:calc(100vh - ${height}px) !important;`;
    //                     //console.log({event,ui});
    //                 }
    //             });
    //         }
    //         else {
    //             $(".code-left").resizable("destroy");
    //             $("#code-all-container").resizable("destroy");
    //             $(".code-left").css({ "width": "48%" });
    //             $(".code-right").css({ "width": "40%" });
    //             $(".code-left").resizable({
    //                 handles: 'e',
    //                 resize: function (event, ui) {
    //                     var width = $(ui.element).width();
    //                     document.getElementById('code-right-container').style = `width:calc(calc(100% - 353px)% - ${width}px) !important;`;
    //                     //console.log({event,ui});
    //                 }
    //             });
    //             $("#code-all-container").resizable({
    //                 handles: 's',
    //                 resize: function (event, ui) {
    //                     var height = $(ui.element).height();
    //                     height += 59;
    //                     document.getElementById('python-area-container').style = `height:calc(100vh - ${height}px) !important;`;
    //                     //console.log({event,ui});
    //                 }
    //             });
    //         }
    //     }
    // })
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
    let m = __modes['.c'];
    codeeditor.setValue(content);
    if (__modes[activeTab.toLowerCase()]) {
        m = __modes[activeTab.toLowerCase()];
    } else {
        let arr = activeTab.toLowerCase().split('.');
        if (__modes["." + arr[arr.length - 1]]) {
            m = __modes["." + arr[arr.length - 1]];
        }
    }
    codeeditor.setOption("mode", m);
}
function initCodeEditor1() {
    codeeditor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: {
            name: "markdown",
            highlightFormatting: true
        },
        lineNumbers: true,
        theme: "default",
        update: function (e, a) {
            console.log({ e, a });
        },
        extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
    });
    codeeditor.on('change', (editor) => {
        const text = editor.doc.getValue()
        __editorConfig.setContent(activeTab, text);

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
    $('.project_list').on('click', function () {
        let project = $(this).data("project_name");
        __editorConfig.setCurrentProject(project);
        if (__editorConfig.activeProject.files && __editorConfig.activeProject.files.length > 0)
            activeTab = __editorConfig.activeProject.files[0].name;

        RenderFileList();
        RenderTabs();
        RenderProjects();
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
        if (activeTabFile && activeTabFile.length > 0) {
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
        createCodeMirror("")
        $("#file-list").html(html);
        return
    }
    for (let i = 0; i < files.length; i++) {
        var isActive = files[i].name === activeTab;
        html += `<li><a href="#" data-file_name='${files[i].name}' ${isActive ? 'class="active file_list"' : 'class="file_list"'}><i class="fa-solid fa-file-code"></i> ${files[i].name} ${false ? '<i class="fa-solid fa-xmark remove-file" id="remove"></i>' : ''}</a></li>`
    }
    $("#file-list").html(html);

    AddFileClickListener();
    __initContextMenu();

}
function RenderProjects() {
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
        html += `<li><a href="#" data-project_name='${projects[i].name}' ${isActive ? 'class="active project_list"' : 'class="project_list"'}><i class="fa-solid fa-file-code"></i> ${projects[i].name} ${false ? '<i class="fa-solid fa-xmark remove-file" id="remove"></i>' : ''}</a></li>`
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
function openRenameDialog(name) {
    $("#rename-file-name").val(name);
    return new Promise((resolve, reject) => {
        $("#rename-f").modal("show");
        $("#rename-file-confirm-btn").on("click", function () {
            resolve({ success: true, name: $("#rename-file-name").val() })
            $("#rename-f").modal("hide");
        })
        $("#rename-file-cancel-btn").on("click", function () {
            resolve({ success: false, name: $("#rename-file-name").val() })
            $("#rename-f").modal("hide");
        })
    })
}
function openDeleteConfirmDialog(n) {
    $("#deleting-file-name").html(n);
    return new Promise((resolve, reject) => {
        $("#remove-f").modal("show");
        $("#delete-cancel-btn").on("click", function () {
            resolve(false)
            $("#remove-f").modal("hide");
        })
        $("#delete-confirm-btn").on("click", function () {
            resolve(true)
            $("#remove-f").modal("hide");
        })
    })
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

    $("#myBtn").on("click", function () {
        $("#myModal").show();
    });
    $("#addFileBtn").on("click", function () {
        $("#add-file-name").val('');
        $("#add-f").show();
    });
    $("#close-file").on("click", function () {
        $("#add-file-name").val('');
        $("#add-f").hide();
    });
    $("#add-file-confirm-btn").on("click", function () {
        if ($("#add-file-name").val()) {
            __editorConfig.addFile($("#add-file-name").val());
            __editorConfig.addActiveFile($("#add-file-name").val());
            activeTab = $("#add-file-name").val();
            RenderFileList();
            RenderTabs();
            $("#add-f").hide();
        }
    });
    $("#createFileForm").on("submit", function (e) {
        e.preventDefault();
        var __fileConfig = $(e.target).serializeArray();
        var fileName = __fileConfig.filter(x => x.name == "name")[0];
        __editorConfig.addProject({ name: fileName.value });
        __editorConfig.setCurrentProject(fileName.value);
        if (__editorConfig.activeProject.files && __editorConfig.activeProject.files.length > 0)
            activeTab = __editorConfig.activeProject.files[0].name;
        RenderProjects();
        RenderFileList();
        RenderTabs();

        $("#myModal").hide();
    });
    $(".content").on("mouseenter", function () {
        $(this).addClass("content-hover");
    })
    $(".content").on("mouseleave", function () {
        $(this).removeClass("content-hover");
    })
    $("#files-name").on("mouseenter", function () {
        $(this).addClass("content-hover");
    })
    $("#files-name").on("mouseleave", function () {
        $(this).removeClass("content-hover");
    })
}