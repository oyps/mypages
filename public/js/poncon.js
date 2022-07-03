const Poncon={title:"My Pages",baseUrl:"",storageKey:"my_pages",entryPage:"#/home",loginStatus:0,tagList:[],pageLoad:{},setting:{},data:{listType:"load",tagListObjSelected:{},tagListObj:{},tagListObjTemp:{}},login(a,e,i){if(!a||!e)return this.notLogin(),!1;var s,d=this;return $.ajax({method:"post",url:this.baseUrl+"api/login.php",data:{username:a,password:e},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){return 200==t.code?(s=!0,d.setStorage("username",a),d.setStorage("password",e),d.loginStatus=1,i&&(location.href=d.entryPage),!0):(i||alert(t.msg),d.notLogin(),s=!1)},async:!1}),s},getStorage(t){var a=localStorage[this.storageKey];try{return JSON.parse(a)[t]}catch{return null}},setStorage(t,a){var e=(e=localStorage[this.storageKey])||"{}";(e=JSON.parse(e))[t]=a,localStorage[this.storageKey]=JSON.stringify(e)},notLogin(){"login"!=location.hash.split("/")[1]&&(location.hash="/login/register")},clickLogin(){var t=$(".page-login .sub-page-login"),a=t.find(".input-username").val(),t=t.find(".input-password").val();a.match(/^\w{4,20}$/)&&t.match(/^\w{8,20}$/)?this.login(a,md5(t))&&(location.href=this.entryPage):alert("请输入正确的格式")},clickRegister(){var t=$(".page-login .sub-page-register"),a=t.find(".input-username").val(),e=t.find(".input-password").val();e!=t.find(".input-password2").val()?alert("两次输入的密码不一致"):a.match(/^\w{4,20}$/)&&e.match(/^\w{8,20}$/)?this.register(a,e):alert("请输入正确的格式")},register(a,e){var i=this;e=md5(e),$.ajax({method:"post",url:this.baseUrl+"api/register.php",data:{username:a,password:e},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code)return i.setStorage("username",a),i.setStorage("password",e),i.loginStatus=1,void(location.href=i.entryPage);alert(t.msg)}})},showModal(t,a,e){var i;"addCollect"==t?(i=$(".modal-addCollect"),"update"==this.editMode&&"add"==a&&this.cleanInput(),$(".modal-addCollect").unbind(),"search"==e?$(".modal-addCollect").on("hidden.bs.modal",function(){var t=$(".modal-searchCollect");t.modal("show"),t.find(".input-keyword").focus()}):"byTag"==e&&$(".modal-addCollect").on("hidden.bs.modal",function(){$(".modal-tagList").modal("show")}),Poncon.loadTagList("edit"),e=Poncon.data.tagListObj,e=this.makeTags(e,"edit"),i.find(".allTagList").html(e),$(".modal-addCollect").modal("show"),i.find(".input-url").removeAttr("readonly"),i.find(".getHost").removeAttr("disabled"),"add"==(this.editMode=a)?($(".modal-addCollect .input-url").focus(),i.find(".addCollect").html("添加收藏"),i.find(".addCollect").html("添加收藏")):(i.find(".addCollect").html("确定编辑"),i.find(".modal-title").html("编辑收藏"))):"searchCollect"==t?((i=$(".modal-searchCollect")).modal("show"),(e=i.find(".input-keyword")).focus(),!e.val()&&i.find(".searchList").html().match(/^\s*$/)&&this.clickSearch()):"tagList"==t?((i=$(".modal-tagList")).modal("show"),this.loadTagList(),this.backToTagList(),i.find(".input-keyword").val("").focus()):"userSetting"==t&&((i=$(".modal-userSetting")).modal("show"),this.loadSetting())},loadSetting(){var t=$(".modal-userSetting"),a=this,e=($("#customSwitch_newWindow")[0].checked=this.setting.newWindowOpen,$("#customSwitch_newWindow").unbind().on("change",function(){var t=$("#customSwitch_newWindow")[0].checked;a.setStorage("newWindowOpen",!t),a.setting.newWindowOpen=t}),window.location.origin+window.location.pathname.replace("index.html","")+"share/?u="+this.getStorage("username"));t.find(".input-shareUrl").val(e)},loadTagList(a){"edit"!=a&&(e=$(".modal-tagList"),(i=this).data.tagListObj={},this.data.tagListObjTemp={},this.data.tagListObjSelected={});var e,i=this;return $.ajax({method:"post",url:this.baseUrl+"api/get_tag_list.php",data:{username:this.getStorage("username"),password:this.getStorage("password")},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code)return"edit"==a?void(i.data.tagListObj=t.data):0==t.data.length?void e.find(".tagList").html(`<img src="img/cat-2722309_640.png" class="img-fluid mb-4" style="max-height: 150px;" alt="暂无标签"><div class="h5 text-muted mb-4">当前暂无标签</div>`):(i.loadTagListHtml(t.data),e.find(".allUnSelectTag").hide(),e.find(".allSelectTag").show(),void e.find(".submitSelect").attr("disabled","disabled"));alert(t.msg)},async:!1}),this.data.tagListObj},loadTagListHtml(t){this.data.tagListObj=t,this.data.tagListObjTemp=t;var a=$(".modal-tagList"),t=this.sortByKey(t),t=this.makeTags(t,"all");a.find(".tagList").html(t)},sortByKey(a){var e={};return Object.keys(a).sort(function(t,a){return t.localeCompare(a)}).forEach(t=>{e[t]=a[t]}),e},addTag(t){var a=$(".modal-addCollect"),t=t||a.find(".input-tagName").val();(t=$.trim(t))&&(this.tagList.push(t),this.tagList=this.unique(this.tagList),a.find(".tagList").html(this.makeTags(this.tagList)),this.giveClick(".tagList"),a.find(".input-tagName").val("").focus())},getHostFromUrl(){var t=$(".modal-addCollect").find(".input-url");try{var a=new URL(t.val())}catch{return void alert("网址格式错误")}t.val(a.origin)},getWebTitle(){var a=this,e=$(".modal-addCollect"),t=e.find(".input-url");try{new URL(t.val())}catch{return void alert("网址格式错误")}t=t.val();e.find("button.getWebTitle").html("获取中").attr("disabled","disabled"),$.ajax({method:"post",url:this.baseUrl+"api/get_title.php",data:{url:t},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){e.find("button.getWebTitle").html("获取").removeAttr("disabled"),e.find(".input-title").val(t.data),t.data&&a.fenci()}})},giveClick(t){var a,e=this;".tagList"==t&&(a=$(".modal-addCollect")).find(".tagList div").unbind().click(function(){var t=$(this).text();e.removeArray(e.tagList,t),a.find(".tagList").html(e.makeTags(e.tagList)),e.giveClick(".tagList"),a.find(".input-tagName").focus()})},addCollect(){var t,a,e=this,i=$(".modal-addCollect"),s=$.trim(i.find(".input-url").val()),d=$.trim(i.find(".input-title").val()),i=$.trim(i.find(".input-note").val());try{new URL(s)}catch{return void alert("网址格式错误")}d?(t=JSON.stringify(this.tagList),a=$("#customSwitch_private")[0].checked?1:0,$.ajax({method:"post",url:this.baseUrl+"api/add_collect.php",data:{username:this.getStorage("username"),password:this.getStorage("password"),url:s,title:d,tags:t,private:a,mode:this.editMode,note:i},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code)return $(".modal-addCollect").modal("hide"),void("add"==e.editMode?(e.loadCollectList(0),e.cleanInput()):"update"==e.editMode&&(e.updateEditingNode(),e.cleanInput()));alert(t.msg)}})):alert("请输入网页标题")},updateEditingNode(){var t=$(this.editingNode),a=$(".modal-addCollect"),e=(t.find(".title").text(a.find(".input-title").val()),t.find(".note").text(a.find(".input-note").val()),t.find(".url").text(a.find(".input-url").val()),t.find(".card-body").attr("data-private",$("#customSwitch_private")[0].checked?1:0),"");this.tagList.forEach(t=>{e+=`<div class="border border-dark rounded small px-2 d-inline-block mr-1 mb-2">${t}</div>`}),t.find(".tags").html(e).attr("data-tags",encodeURIComponent(JSON.stringify(this.tagList))),t.find(".update_time").html(this.parseDate((new Date).getTime()))},cleanInput(){var t=$(".modal-addCollect");t.find(".input-url").val(""),t.find(".input-title").val(""),t.find(".input-tagName").val(""),this.tagList=[],t.find(".tagList").html(""),t.find(".input-note").val("")},removeArray(e,i){return e.map((t,a)=>{t==i&&e.splice(a,1)}),e},makeTags(t,a){var e="";if("all"==a){for(var i in t)e+=`<div class="btn btn-sm btn-light border mb-2 mr-2" onclick="Poncon.tagListChecked(event)"><span class="tag">${i}</span> <span class="ml-1 badge badge-light">${t[i]}</span></div>`;return e}if("edit"!=a)return t.forEach(t=>{e+=`<div class="btn btn-sm btn-secondary mb-2 mr-2">${t}</div>`}),e;for(i in t)e+=`<div class="btn btn-sm btn-light border mb-2 mr-2" onclick="Poncon.addTagListChecked(event)"><span class="tag">${i}</span> <span class="ml-1 badge badge-light">${t[i]}</span></div>`;return e},addTagListChecked(t){var t=$(t.target),t=(t=t.hasClass("btn")?t:t.parent()).find(".tag").text(),a=$(".modal-addCollect");(t=$.trim(t))&&(this.tagList.push(t),this.tagList=this.unique(this.tagList),a.find(".tagList").html(this.makeTags(this.tagList)),this.giveClick(".tagList"),a.find(".input-tagName").val("").focus())},tagListChecked(t){var a,t=$(t.target),e=(t=t.hasClass("btn")?t:t.parent()).find(".tag").text();t.hasClass("btn-light")?(t.removeClass("btn-light"),t.addClass("btn-primary"),t.removeClass("bg-warning"),this.data.tagListObjSelected[e]=this.data.tagListObj[e]):(t.removeClass("btn-primary"),t.addClass("btn-light"),this.indexTags(),delete this.data.tagListObjSelected[e]),Object.keys(this.data.tagListObjSelected).length==Object.keys(this.data.tagListObjTemp).length&&0<Object.keys(this.data.tagListObjTemp).length?((a=$(".modal-tagList")).find(".allUnSelectTag").show(),a.find(".allSelectTag").hide()):((a=$(".modal-tagList")).find(".allUnSelectTag").hide(),a.find(".allSelectTag").show()),this.disabledButton()},fenci(){var a=this,t=$(".modal-addCollect"),e=t.find(".input-title").val(),t=t.find(".input-note").val();$.ajax({url:this.baseUrl+"api/fenci.php",type:"GET",data:{text:e+" "+t},success:t=>{200==t.code&&t.data.forEach(t=>{1<t.length&&a.addTag(t)})}})},screeningTag(){var t,a=$(".modal-tagList"),e=$.trim(a.find(".input-keyword").val());for(t in this.data.tagListObjSelected={},this.data.tagListObjTemp={},this.data.tagListObj)-1!=t.indexOf(e)&&(this.data.tagListObjTemp[t]=this.data.tagListObj[t]);var i=this.data.tagListObjTemp,i=this.sortByKey(i);a.find(".tagList").html(this.makeTags(i,"all")),e&&this.allSelectTag(),this.backToTagList()},indexTags(){for(var t=$(".modal-tagList"),a=$.trim(t.find(".input-keyword").val()),e=t.find(".tagList .btn"),i=0;i<e.length;i++)-1!=e[i].innerText.search(a)&&a?$(e[i]).addClass("bg-warning"):$(e[i]).removeClass("bg-warning")},allSelectTag(){var t=$(".modal-tagList"),t=(t.find(".allUnSelectTag").show(),t.find(".allSelectTag").hide(),$(".tagList"));t.find(".btn").removeClass("btn-light"),t.find(".btn").addClass("btn-primary"),this.data.tagListObjSelected=JSON.parse(JSON.stringify(this.data.tagListObjTemp)),this.disabledButton()},allUnSelectTag(){var t=$(".modal-tagList"),t=(t.find(".allUnSelectTag").hide(),t.find(".allSelectTag").show(),$(".tagList"));t.find(".btn").removeClass("btn-primary"),t.find(".btn").addClass("btn-light"),this.data.tagListObjSelected={},this.disabledButton()},disabledButton(){0==Object.keys(this.data.tagListObjSelected).length?$(".modal-tagList").find(".submitSelect").attr("disabled","disabled"):$(".modal-tagList").find(".submitSelect").removeAttr("disabled")},loadCollectListByTag(t,e){var i,s;isNaN(e)||(i=$(".modal-tagList"),0==e&&(i.find(".tagList").hide(),i.find(".collectList").html("").show(),i.find(".allSelectTag, .allUnSelectTag").hide(),i.find(".submitSelect").hide(),i.find(".backToList").show()),t=JSON.stringify(Object.keys(t)),s=this,$.ajax({method:"post",url:this.baseUrl+"api/get_collect_list_by_tag.php",data:{tags:t,username:this.getStorage("username"),password:this.getStorage("password"),page:e,pageSize:36},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code){var a=t.data;if(0==a.length)return void(s.setting.isBottom_byTag=1);a=s.makeList(a,"byTag");return i.find(".collectList").append(a),new ClipboardJS(".copybtn",{container:i[0]}),s.data.nowPage_byTag=e,void(s.setting.isBottom_byTag=0)}s.setting.isBottom_byTag=1,alert(t.msg)}}))},backToTagList(){var t=$(".modal-tagList");t.find(".tagList").show(),t.find(".collectList").hide(),t.find(".submitSelect").show(),t.find(".backToList").hide(),Object.keys(this.data.tagListObjSelected).length==Object.keys(this.data.tagListObjTemp).length&&0<Object.keys(this.data.tagListObjTemp).length?((t=$(".modal-tagList")).find(".allUnSelectTag").show(),t.find(".allSelectTag").hide()):((t=$(".modal-tagList")).find(".allUnSelectTag").hide(),t.find(".allSelectTag").show())},inputKeyup(t,a){13==t.keyCode&&this[a]()},randomColor(){var t=["danger","secondary","primary","dark","info","success"];return t[Math.floor(Math.random()*t.length)]},unique(t){for(var a=0;a<t.length;a++)for(var e=a+1;e<t.length;e++)t[a]==t[e]&&(t.splice(e,1),e--);return t},loadCollectList(a){var e=this,i=$(".page-home");0==a&&i.find(".collectList").html(""),$.ajax({method:"post",url:this.baseUrl+"api/get_collect_list.php",data:{username:this.getStorage("username"),password:this.getStorage("password"),page:a,pageSize:36},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code){if(0==t.data.length)return void(e.setting.isBottom=1);t=e.makeList(t.data);return i.find(".collectList").append(t),new ClipboardJS(".copybtn"),e.data.nowPage=a,void(e.setting.isBottom=0)}e.setting.isBottom=1}})},makeList(t,e){var i="";return _class="search"==e||"byTag"==e?"mb-4":"col-xl-4 col-lg-6 mb-4",t.forEach(t=>{var a="";t.tag_list.forEach(t=>{a+=`<div class="border border-dark rounded px-2 d-inline-block mr-1 mb-2 small">${t}</div>`}),i+=`<div class="${_class}"><div class="card shadow-sm h-100 border-secondary bg-light"><div class="card-body px-3 py-2 d-flex flex-column justify-content-center" data-private="${t.private}"><div class="title mb-1 oyp-limit-line font-weight-bold" title="${t.title}" onclick="Poncon.goHref('${t.url}');">${t.title}</div><a class="text-secondary url oyp-limit-line small mb-1" href="${t.url}" onclick="Poncon.goHref('${t.url}'); return false;">${t.url}</a><div class="note text-info mb-1">${t.note}</div><div class="tags" data-tags="${encodeURIComponent(JSON.stringify(t.tag_list))}">${a}</div><div class="btns"><a class="text-danger mr-2" onclick="Poncon.listItemDelete(event, '${t.url}', '${t.update_time}')">删除</a><a class="text-primary mr-2 copybtn" data-clipboard-text="${t.url}" onclick="alert('复制成功')">复制</a><a class="text-success mr-2" onclick="Poncon.listItemEdit(event, '${e}')">编辑</a><span class="float-right text-muted update_time">${this.parseDate(1e3*parseInt(t.update_time))}</span></div></div></div></div>`}),i},listItemEdit(t,a){var e=$(t.target).parents(".card-body"),i=e.find(".title").text(),s=e.find(".url").text(),d=e.find(".note").text(),l=JSON.parse(decodeURIComponent(e.find(".tags").attr("data-tags"))),l=(this.tagList=l,this.tagList=this.unique(this.tagList),e.attr("data-private")),e=(this.showModal("addCollect","update",a),"search"==a?$(".modal-searchCollect").modal("hide"):"byTag"==a&&$(".modal-tagList").modal("hide"),$(".modal-addCollect"));e.find(".tagList").html(this.makeTags(this.tagList)),this.giveClick(".tagList"),e.find(".input-title").val(i),e.find(".input-note").val(d),e.find(".input-url").val(s).attr("readonly","readonly"),e.find(".getHost").attr("disabled","disabled"),e.find("#customSwitch_private")[0].checked="1"==l,this.editMode="update",this.editingNode=$(t.target).parents(".mb-4")},listItemDelete(a,t,e){confirm("确定删除吗？")&&$.ajax({method:"post",url:this.baseUrl+"api/delete_collect.php",data:{username:this.getStorage("username"),password:this.getStorage("password"),url:t,time:e},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){200==t.code?$(a.target).parent().parent().parent().parent().remove():alert(t.msg)}})},goHref(t){this.setting.newWindowOpen?window.open(t):location.href=t},parseDate(t){function a(t){return t<10?"0"+t:t}return a((t=new Date(t)).getFullYear())+"-"+a(t.getMonth()+1)+"-"+a(t.getDate())+" "+a(t.getHours())+":"+a(t.getMinutes())},clickSearch(){var t=$(".modal-searchCollect").find(".input-keyword").val();this.searchCollect(t,0)},searchCollect(e,i){var s=this,d=$(".modal-searchCollect");0==i&&d.find(".searchList").html(""),$.ajax({method:"post",url:this.baseUrl+"api/search.php",data:{username:this.getStorage("username"),password:this.getStorage("password"),keyword:e,page:i,pageSize:36},contentType:"application/x-www-form-urlencoded",dataType:"json",success:function(t){if(200==t.code){if(0==t.data.length)return void(s.setting.isBottom_search=1);var a=s.makeList(t.data,"search");return d.find(".searchList").append(a),new ClipboardJS(".copybtn",{container:d[0]}),s.data.nowPage_search=i,s.data.keyword=e,void(s.setting.isBottom_search=0)}this.setting.isBottom_search=1,alert(t.msg)}})},logout(){confirm("确定退出吗？")&&(localStorage.removeItem(this.storageKey),location.reload())}};