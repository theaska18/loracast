//MEMATIKAN DRAG DROP WEB
window.addEventListener("dragover",function(e){
	  e = e || event;
	  e.preventDefault();
},false);
window.addEventListener("drop",function(e){
	  e = e || event;
	  e.preventDefault();
},false);

Ext.Loader.setConfig({disableCaching: false});
Ext.Ajax.disableCaching = false;
Ext.util.Format.thousandSeparator='.';
Ext.util.Format.decimalSeparator=',';
Ext.override(Ext.data.proxy.Ajax, { timeout: 600000 });
Ext.override(Ext.form.action.Action, { timeout: 3600000 });
Ext.data.Connection.override({
	request:function(options){
		var me=this;
		if(!options.params){options.params={};}
		if(_session_id != undefined){options.params.session=_session_id;}
		return me.callOverridden(arguments);
	}
});
Ext.Ajax.on('beforerequest', function(conn, options) {
	if (options.before && typeof options.before === 'function') {return options.before.call(options)}else{return true;}
});
function showTab(){
	Ext.getCmp('main.body').getTabBar().show();
}
function hideTab(){
	Ext.getCmp('main.body').getTabBar().hide();
}
function addTabSession(list,idx,callback,$ini){
	if(list.length-1 >= idx){
		$ini.addTab(list[idx],undefined,function(){
			addTabSession(list,idx+1,callback,$ini);
		});
	}else{
		if(callback != undefined){
			callback();
		}
	}
}
function addScript(filepath, callback){
    if (filepath) {
		if(filepath.indexOf('.js')>=0){
			var fileref = document.createElement('script');
			fileref.onload = callback;
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", url+filepath);
			if (typeof fileref!="undefined"){
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		}else if(filepath.indexOf('.css')>=0){
			var fileref = document.createElement('link');
			fileref.onload = callback;
			fileref.setAttribute("type","text/css");
			fileref.setAttribute("href", url+filepath);
			fileref.setAttribute("rel", "stylesheet");
			if (typeof fileref!="undefined"){
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		}
    }
}
function importComponentDetail(imports){
	var det=null,imp=null,imps=[];
	for(var i=0,iLen=imports.length;i<iLen;i++){
		imp=imports[i];
		if(imp.indexOf('/')<0){
			if(_local_storage.imports[imp]!= undefined){
				det=_local_storage.imports[imp];
				for (var key in det.setting) {
					if(_setting[key]==undefined){
						_setting[key]={};
					}
					for (var key1 in det.setting[key]) {
						_setting[key][key1]=det.setting[key][key1];
					}
				}
				if(_import_list.indexOf(imp)<0){
					_import_list.push(imp);
					var daten=importComponentDetail(det.imports);
					eval(det.script);
					for(var j=0,jLen=daten.length;j<jLen;j++){
						imps.push(daten[j]);
					}
					
				}
			}else{
				//_import_list.push(imp);
				imps.push(imp);
				_local_storage.imports[imp]={script:'',imports:[]};
			}
		}else{
			imps.push(imp);
		}
	}
	return imps;
}
function importComponentAll(imports,callback,parameter){
	var tmp=imports;
	if(imports.length>0){
		var arrJs=[];
		var jsImp=null;
		for(var i=0,iLen=imports.length;i<iLen;i++){
			if(imports[i].indexOf('/')>=0){
				jsImp=imports[i];
				_import_list.push(jsImp);
				imports.splice(i,1);
				break;
			}
		}
		if(jsImp !=null){
			addScript(jsImp,function(){
				importComponentAll(imports,function(parameter){
					callback(true,parameter);
				},parameter);
			});
		}else{
			Ext.Ajax.request({
				url : url+'cmd/imports',
				method : 'GET',
				params:{param:JSON.stringify(imports)},
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var imp=[],det=null,impo={},script=[];
						for(var obj in r.d.imports){
							det=r.d.imports[obj];
							script.push(det.script);
							for(var j=0,jLen=det.imports.length;j<jLen;j++){
								imp.push(det.imports[j]);
							}
							for (var key in det.setting) {
								if(_setting[key]==undefined){
									_setting[key]={};
								}
								for (var key1 in det.setting[key]) {
									_setting[key][key1]=det.setting[key][key1];
								}
							}
							_local_storage.imports[obj]=det;
						}
						importComponent(imp,function(parameter){
							for(var j=0,jLen=script.length;j<jLen;j++){
								
								eval(script[j]);
							}
							callback(true,parameter);
						},script)
					}
				},failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);callback(false,parameter);}
			});
		}
	}else{
		callback(true,tmp);
	}
}
function importComponent(imports,callback,parameter){
	var tmp=imports;
	importsa=importComponentDetail(imports);
	importComponentAll(importsa,function(importComponentAll){
		callback(true,parameter);
	},parameter);
}
function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}
function nextFocus(textfield,e){
	if(textfield.submit != undefined){
		if(textfield.validate()==true){
			var pnl=null;
			if(typeof textfield.submit=='string'){
				pnl=textfield.submit;
			}else{
				if(textfield.submit !=undefined){
					pnl=textfield.submit(textfield);
				}else{
					return false;
				}
			}
			if(typeof pnl=='string'){
				var com=Ext.getCmp(pnl);
				var fields = com.query('field');
				if (!Ext.isEmpty(fields)) {
					var fieldCount = fields.length,
						index      = fields.indexOf(textfield),
						nextIndex  = (!e.shiftKey) ? index + 1 : index - 1,
						focusField = function (index) {
							fields[index].focus();
						},ada=false,allow=true;
					while(ada==false){
						if(fields[nextIndex] != undefined){
							if(fields[nextIndex].xtype=='idisplayfield' || 
								fields[nextIndex].xtype=='ihiddenfield' || 
								fields[nextIndex].xtype=='hiddenfield' || 
								fields[nextIndex].xtype=='displayfield' || 
								fields[nextIndex].hidden==true  || 
								fields[nextIndex].readOnly==true || 
								fields[nextIndex].disabled==true
								&&(nextIndex<fieldCount-1)){
								nextIndex++;
							}else{
								ada=true;
							}
						}else{
							if(com.submit != undefined){
								var btn=null;
								if(typeof com.submit=='string'){
									btn=com.submit;
								}else{
									btn=com.submit(com);
								}
								if(typeof btn=='string'){
									var comBtn=Ext.getCmp(btn);
									if(comBtn!= undefined && comBtn.focus != undefined){
										comBtn.focus();
										allow=false;
										ada=true;
									}else{
										nextIndex=0;
									}
								}else{
									nextIndex=0;
								}
							}else{
								nextIndex=0;
							}
						}
					}
					if(allow==true){
						if (fieldCount === nextIndex) {
							focusField(0);
						} else if (nextIndex < 0) {
							focusField(fieldCount - 1);
						} else {
							focusField(nextIndex);
						}
					}
				}
			}
		}
	}	
}
function _notif(title,msg) {
	if (typeof Notification !== 'undefined') {
		Notification.requestPermission(function(result) {
			if (result === 'granted') {
				navigator.serviceWorker.ready.then(function(registration) {
					var fecha = Date.now("Y-m-d");
					registration.showNotification(title, {
						icon: url+'upload/'+_tenant_logo,
						body: msg,
					});
				});
			}
		});
	}else{
		navigator.serviceWorker.ready.then(function(registration) {
			var fecha = Date.now("Y-m-d");
			registration.showNotification(title, {
				icon: url+'upload/'+_tenant_logo,
				body: msg,
			});
		});
	}
}
Ext.setGlyphFontFamily('FontAwesome');
// window.onerror = function(error) {Ext.MessageBox.alert('Error', "Error '"+ error +"', Please Contact Admin.");};
var _listAjax=[],_listAjaxSession=[],_execAjax=false,_execAjaxSession=false;
function _langLine(str,arr){if(arr != undefined && arr != null){for(var indeks in arr){str=str.replace('{'+indeks+'}',arr[indeks]);}}return str;}
var serialize = function(obj) {
	var str = [];
	for(var p in obj){if (obj.hasOwnProperty(p)) {str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));}}
	return iif(str=='','','&')+str.join("&");
};
// var config = {
    // apiKey: "AIzaSyAfupHi5lLyiuSVVS058JzS_OnIchmahRM",
    // authDomain: "sikamal-40b79.firebaseapp.com",
    // databaseURL: "https://sikamal-40b79.firebaseio.com",
    // projectId: "sikamal-40b79",
    // storageBucket: "sikamal-40b79.appspot.com",
    // messagingSenderId: "650744576707"
// };
// firebase.initializeApp(config);
// firebase.auth().onAuthStateChanged(function(user) {
	// if (user) {var isAnonymous = user.isAnonymous;var uid = user.uid;} else {}
// });
// firebase.auth().signInAnonymously().catch(function(error) {
	// var errorCode = error.code;
	// var errorMessage = error.message;
// });
var lib={
	text:{
		val:function($this,val){
			var textfield=this,
			property=$this.app;
			val=val.trim().replace(/  +/g, ' ');
			val=iif((property.space != undefined && property.space===false),val.replace(/ /g,''),val);
			val=iif((property.upper != undefined && property.upper===true),val.toUpperCase(),val);
			val=iif((property.lower != undefined && property.lower===true),val.toLowerCase(),val);
			val=iif((property.dynamic != undefined && property.dynamic===true),val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);}),val);
			return val;
		}
	},
	number:{
		formatToNumber:function(text,lang){
			lang=iif(lang==undefined,window.navigator.language,lang);
			var exNum=1.5;
			exNum=exNum.toLocaleString(lang).toString();
			var desimal=exNum.substring(1,2);
			text=text.toString().replace(/[^0-9\.,-]/g, '');
			if(desimal==','){text=text.replace(/\./g,'');text=text.replace(/\,/g,'.');}else{text=text.replace(/\,/g,'');}
			return Number(text);
		}
	},
	newTabMenu:function(){
		var cmpnya=Ext.getCmp(shortcut.getModule());
		var arrData={code:cmpnya.code,text:cmpnya.qtip,icon:cmpnya.iconCls};
		var win = window.open(url+'page/'+_session_id+'?m='+btoa(JSON.stringify(arrData)), '','postwindow');
		win.focus();
	}
};
// var commentsRef = firebase.database().ref('socket');
// commentsRef.on('child_added', function(data){socket.onmessage(data.val());});
// commentsRef.on('child_changed', function(data){socket.onmessage(data.val());});
// commentsRef.on('child_removed', function(data){socket.onmessage(data.val());});
var shortcut={
	id:'',
	storage:null,
	execute:function(a,e){
		this.storage=JSON.parse(localStorage.getItem('shortcut'));
		this.id=this.getModule();
		if(this.storage != undefined && this.storage != null){
			if(this.storage[this.id] != undefined){
				if(this.storage[this.id].length>0){
					if(this.storage[this.id][0] != undefined){
						var listKey=this.storage[this.id][0].list;
						for(var i=0,iLen=listKey.length; i<iLen;i++){
							if(a==listKey[i].key){e.preventDefault();eval(listKey[i].fn);f();}
						}
					}
				}
			}
		}
	},
	set:function(fn){
		this.storage=JSON.parse(localStorage.getItem('shortcut'));
		this.id=this.getModule();
		if(fn.module != undefined && fn.module !=''){this.id='main.tab'+fn.module;}
		if(this.storage==undefined || this.storage==null){
			this.storage={};
			this.storage[this.id]=[];
		}else{if(this.storage[this.id] == undefined ||this.storage[this.id]==null){this.storage[this.id]=[];}}
		for(var i=0,iLen=this.storage[this.id].length;i<iLen;i++){if(this.storage[this.id][i] != undefined){if(this.storage[this.id][i].code==fn.code){this.storage[this.id].splice(i,1);}}}
		for(var i=0,iLen=fn.list.length;i<iLen;i++){fn.list[i].fn="var f="+String(fn.list[i].fn);}
		this.storage[this.id].unshift(fn);
		localStorage.setItem('shortcut',JSON.stringify(this.storage));
	},
	remove:function(code){
		this.id=this.getModule();
		this.storage=JSON.parse(localStorage.getItem('shortcut'));
		if(this.storage != undefined && this.storage != null){
			if(this.storage[this.id] != undefined){
				if(this.storage[this.id].length>0){
					for(var i=0,iLen=this.storage[this.id].length;i<iLen;i++){
						if(this.storage[this.id][i].code==code){this.storage[this.id].splice(i,1);break;}
					}
				}
			}
		}
		localStorage.setItem('shortcut',JSON.stringify(this.storage));
	},
	getModule:function(){return Ext.getCmp('main.body').getActiveTab().id;}
};
$(document).unbind().bind('keydown',function(e){
	var nav=navigator.platform.match("Mac");
	if (e.keyCode == 70 && ( nav? e.metaKey : e.ctrlKey) && ( nav? e.metaKey : e.shiftKey )){shortcut.execute('ctrl+shift+f',e);
	}else if (e.keyCode == 70 && ( nav? e.metaKey : e.ctrlKey)){shortcut.execute('ctrl+f',e);
	}else if (e.keyCode == 82 && ( nav? e.metaKey : e.ctrlKey)){shortcut.execute('ctrl+r',e);
	}else if (e.keyCode == 83 && ( nav? e.metaKey : e.ctrlKey)){shortcut.execute('ctrl+s',e);
	}else if(e.keyCode == 27){shortcut.execute('esc',e);
	}else if(e.keyCode == 112){shortcut.execute('f1',e);
	}else if(e.keyCode == 113){shortcut.execute('f2',e);
	}else if(e.keyCode == 114){shortcut.execute('f3',e);
	}else if(e.keyCode == 115){shortcut.execute('f4',e);
	}else if(e.keyCode == 116){shortcut.execute('f5',e);
	}else if(e.keyCode == 117){shortcut.execute('f6',e);
	}else if(e.keyCode == 118){shortcut.execute('f7',e);
	}else if(e.keyCode == 119){shortcut.execute('f8',e);
	}else if(e.keyCode == 120){shortcut.execute('f9',e);
	}else if(e.keyCode == 121){shortcut.execute('f10',e);
	}else if(e.keyCode == 122){shortcut.execute('f11',e);
	}else if(e.keyCode == 123){shortcut.execute('f12',e);}
});
function toInt(val){val=iif((val==null || val==''),0,val);return parseInt(val);}
function _access(code,callback){
	var block=false;
	for(var i=0, iLen=_access_list.length; i<iLen;i++){var o=_access_list[i];if(o.acces_type=='ACCESSTYPE_CODE'){if(o.access_code==code){block=true;break;}}}
	if(callback != undefined){if(block==true){Ext.create('IToast').toast({msg : 'access on the block.',type : 'privilege'});}else{callback();}}
	return block;
}
function _get_session(name,getNull){
	var ses=localStorage.getItem(name);return JSON.parse(ses);
}
function _set_session(name,item){
	localStorage.setItem(name,JSON.stringify(item));
}
function _click(name){if(Ext.get(name) != undefined){Ext.get(name).dom.click();}}
function _ctrl(ini,e){
	var nav=navigator.platform.match("Mac");
	function ctrlPress(code,control){
		if (e.keyCode == code && ( nav? e.metaKey : e.ctrlKey)){
			if(ini.press != undefined && ini.press[control] !== undefined){
				if(ini.press[control+'_key'] == undefined || (ini.press[control+'_key'] != undefined && ini.press[control+'_key'] === false)){e.preventDefault();}
				ini.press[control](ini,e);
				return true;
			}
		}
		return false;
	}
	if(ctrlPress(65,'ctrla')===true){return true;}
	if(ctrlPress(66,'ctrlb')===true){return true;}
	if(ctrlPress(67,'ctrlc')===true){return true;}
	if(ctrlPress(68,'ctrld')===true){return true;}
	if(ctrlPress(69,'ctrle')===true){return true;}
	if(ctrlPress(70,'ctrlf')===true){return true;}
	if(ctrlPress(71,'ctrlg')===true){return true;}
	if(ctrlPress(72,'ctrlh')===true){return true;}
	if(ctrlPress(73,'ctrli')===true){return true;}
	if(ctrlPress(74,'ctrlj')===true){return true;}
	if(ctrlPress(75,'ctrlk')===true){return true;}
	if(ctrlPress(76,'ctrll')===true){return true;}
	if(ctrlPress(77,'ctrlm')===true){return true;}
	if(ctrlPress(78,'ctrln')===true){return true;}
	if(ctrlPress(79,'ctrlo')===true){return true;}
	if(ctrlPress(80,'ctrlp')===true){return true;}
	if(ctrlPress(81,'ctrlq')===true){return true;}
	if(ctrlPress(82,'ctrlr')===true){return true;}
	if(ctrlPress(83,'ctrls')===true){return true;}
	if(ctrlPress(84,'ctrlt')===true){return true;}
	if(ctrlPress(85,'ctrlu')===true){return true;}
	if(ctrlPress(86,'ctrlv')===true){return true;}
	if(ctrlPress(87,'ctrlw')===true){return true;}
	if(ctrlPress(88,'ctrlx')===true){return true;}
	if(ctrlPress(89,'ctrly')===true){return true;}
	if(ctrlPress(90,'ctrlz')===true){return true;}
	if (e.keyCode == 13){if(ini.press != undefined){if(ini.press.enter != undefined){
		if(ini.property !=undefined && ini.property.type=='dropdown'){
			if(!ini.isExpanded){e.preventDefault();ini.press.enter(ini,e);return false;}
		}else{e.preventDefault();ini.press.enter(ini,e);return false;}
	}}}
	if (e.keyCode == 46){if(ini.press != undefined){if(ini.press.delete != undefined){e.preventDefault();ini.press.delete(ini,e);return false;}}}
	if (e.keyCode == 32){if(ini.press != undefined){if(ini.press.space != undefined){e.preventDefault();ini.press.space(ini,e);return false;}}}
	if (e.keyCode == 8){if(ini.press != undefined){if(ini.press.backspace != undefined){e.preventDefault();ini.press.backspace(ini,e);return false;}}}
	if (e.keyCode == 40){if(ini.press != undefined){if(ini.press.down != undefined){e.preventDefault();ini.press.down(ini,e);return false;}}}
	if (e.keyCode == 38){if(ini.press != undefined){if(ini.press.up != undefined){e.preventDefault();ini.press.up(ini,e);return false;}}}
	if (e.keyCode == 37){if(ini.press != undefined){if(ini.press.left != undefined){e.preventDefault();ini.press.left(ini,e);return false;}}}
	if (e.keyCode == 39){if(ini.press != undefined){if(ini.press.right != undefined){e.preventDefault();ini.press.right(ini,e);return false;}}}
	if (e.keyCode == 49){if(ini.press != undefined){if(ini.press.num1 != undefined){e.preventDefault();ini.press.num1(ini,e);return false;}}}
	if (e.keyCode == 48){if(ini.press != undefined){if(ini.press.num0 != undefined){e.preventDefault();ini.press.num0(ini,e);return false;}}}
	if (e.keyCode == 50){if(ini.press != undefined){if(ini.press.num2 != undefined){e.preventDefault();ini.press.num2(ini,e);return false;}}}
	if (e.keyCode == 51){if(ini.press != undefined){if(ini.press.num3 != undefined){e.preventDefault();ini.press.num3(ini,e);return false;}}}
	if (e.keyCode == 52){if(ini.press != undefined){if(ini.press.num4 != undefined){e.preventDefault();ini.press.num4(ini,e);return false;}}}
	if (e.keyCode == 53){if(ini.press != undefined){if(ini.press.num5 != undefined){e.preventDefault();ini.press.num5(ini,e);return false;}}}
	if (e.keyCode == 54){if(ini.press != undefined){if(ini.press.num6 != undefined){e.preventDefault();ini.press.num6(ini,e);return false;}}}
	if (e.keyCode == 55){if(ini.press != undefined){if(ini.press.num7 != undefined){e.preventDefault();ini.press.num7(ini,e);return false;}}}
	if (e.keyCode == 56){if(ini.press != undefined){if(ini.press.num8 != undefined){e.preventDefault();ini.press.num8(ini,e);return false;}}}
	if (e.keyCode == 57){if(ini.press != undefined){if(ini.press.num9 != undefined){e.preventDefault();ini.press.num9(ini,e);return false;}}}
}
function ajaxError(jqXHR, exception,thisAjax) {
	var type=0;
	if (jqXHR.status === 0) {
		if(thisAjax!= undefined && thisAjax==true){
			_listAjax.push(jqXHR);
			if(_execAjax==false){
				_execAjax=true;
				Ext.MessageBox.alert('Disconnect', 'Not connect. Verify Network . Retry ?', function(){
					for(var i=0,iLen=_listAjax.length; i<iLen;i++){Ext.Ajax.request(_listAjax[i].request.options);}
					_listAjax=[];
					_execAjax=false;
				});
			}
		}else{
			Ext.create('IToast').toast({msg : 'Not connect. Verify Network .',type : 'error'});
		}
	} else if (jqXHR.status == 404) {type=1;Ext.create('IToast').toast({msg : 'Requested page not found. [404]',type : 'error'});
	} else if (jqXHR.status == 500) {type=2;Ext.create('IToast').toast({msg : 'Internal Server Error .[ 500 ]',type : 'error'});
	} else if (exception === 'parsererror') {type=3;Ext.create('IToast').toast({msg : 'Requested JSON parse failed.',type : 'error'});
	} else if (exception === 'timeout') {type=4;Ext.create('IToast').toast({msg : 'Time out error .',type : 'error'});
	} else if (exception === 'abort') {type=5;Ext.create('IToast').toast({msg : 'Ajax request aborted.',type : 'error'});
	} else {type=6;Ext.create('IToast').toast({msg : 'Error is not known , please contact Admin .',type : 'error'});}
	return type;
}
function _notice(code,count){
	var btnMenu=$('#menu-notice-'+code);
	if(count>0){
		mainTab=Ext.getCmp('main.tab'+ code);
		if(mainTab== undefined){btnMenu.show();btnMenu.html(count);
		}else{if(mainTab.componentLayout.initialized==false){btnMenu.show();btnMenu.html(count);}}
	}else{btnMenu.attr('stop',true);btnMenu.fadeOut(500);btnMenu.hide();btnMenu.html('');}
}
function ajaxSuccess(r,nonObject) {
	if (typeof r=='object') {
		if (/^[\],:{}\s]*$/.test(r.responseText.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
				replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
			var response=Ext.decode(r.responseText),res=response.r,mes=response.m;
			switch(res) {
			    case 'S':if (mes != ''){Ext.create('IToast').toast({msg : mes,type : 'success'});}break;
			    case 'W':if (mes != ''){Ext.create('IToast').toast({msg : mes,type : 'warning'});}break;
			    case 'E':if (mes != ''){Ext.create('IToast').toast({msg : mes,type : 'error'});}break;
			    case 'P':Ext.create('IToast').toast({msg : 'access on the block, you can not use the service.',type : 'privilege'});break;
			    case 'F':
			    	var ses=Ext.getCmp('session');
			    	if(ses== undefined){
						// var sesi=_get_session(session_name,true);
						_listAjaxSession.push(r);
						if(_execAjaxSession==false){
							_execAjaxSession=true;
							Ext.create('ISession').show();
							Ext.getCmp('session.f1').setValue(session.userName);
							Ext.getCmp('session.f2').focus();
						}
			    	}
			        break;
			    default:Ext.create('IToast').toast({msg : 'Submissions are not known , contact the Admin.[3]',type : 'error'});break; 
			}
			return response;
		}else if(nonObject != undefined && nonObject==true){return {r:'S'};}else{
			Ext.create('IToast').toast({msg : 'Submissions are not known , contact the Admin.[2]',type : 'error'});return {r:'E'};
		}
	}else{Ext.create('IToast').toast({msg : 'Submissions are not known , contact the Admin.[1]',type : 'error'});return {r:'E'};}
}
function _view(uri){
	Ext.getCmp('main.view').show();
	if(_mobile==false){Ext.getCmp('main.view').setWidth(550);}
	Ext.getCmp('main.view').update('<iframe src="'+url+'viewer/#'+uri+'&session='+_session_id+'" style="width: 100%; height: 100%;"></iframe>');
}
function getSetting(mod,code){
	if(_setting[mod] != undefined && _setting[mod] != null){
		if(_setting[mod][code] != undefined){return _setting[mod][code];
		}else{
			Ext.create('IToast').toast({msg : "Tidak Ada Setting Untuk Menu Code '"+mod+"' dan Kode Setting '"+code+"'.",type : 'error'});
		}
	}else{Ext.create('IToast').toast({msg : "Tidak Ada Setting Untuk Menu Code '"+mod+"' dan Kode Setting '"+code+"'.",type : 'error'});}
}
function iif(kodisi,kondisi1,kondisi2){if(kodisi===true){return kondisi1;}else{return kondisi2;}}
function _url(param1,param2){return url + 'cmd?m='+param1+'&f='+param2;}
//itextfield
Ext.define('ITextField', {
	alias:'widget.itextfield',
	extend: 'Ext.form.TextField',
	property:{},
	press:{},
	event:{},
	// html:'dawd',
	enableKeyEvents:true,
	margin:true,
	maxLength:64,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='textfield';
		if(this.listeners==undefined){this.listeners=[];}	
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			textfield.val(textfield.getValue());
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : $this.user_property.code,name:$this.user_property.name,value:$this.getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		};
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			if(e.keyCode == 13){textfield.val(textfield.getValue());}
			_ctrl(textfield,e);
			return false;
		};
		this.listeners.keydown=keydown;
		//keyup
		var keyupOri=null;
		if(this.listeners.keyup!=undefined){keyupOri=this.listeners.keyup;}
		var keyup=function(textfield,e){
			if(keyupOri != null){keyupOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				nextFocus(textfield,e);	
			}
			return false;
		};
		this.listeners.keyup=keyup;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';		
		};
		if($this.note != undefined && $this.note !=''){
			$this.on({
				afterrender:$this.calculate,
				scope:$this
			});
		}
		this.callParent(arguments);
	},
	calculate:function(textfield,e){
		var me=this,
			span=Ext.dom.Query.select('input',me.getEl().dom)[0];
		var newEl=document.createElement('td');
		newEl.innerHTML='&nbsp;<span class="fa fa-info-circle" title="'+me.note+'"></span>';
		newEl.style.width='20px';
		if(me.labelAlign=='top'){
			newEl.style['padding-top']='13px';
		}
		span.parentNode.parentNode.append(newEl);
	},
	val:function(val){
		var textfield=this,property=textfield.property;
		val=val.trim().replace(/  +/g, ' ');
		if(property.space != undefined && property.space===false){val=val.replace(/ /g,'');}
		if(property.upper != undefined && property.upper===true){val=val.toUpperCase();}
		if(property.lower != undefined && property.lower===true){val=val.toLowerCase();}
		if(property.dynamic != undefined && property.dynamic===true){val=val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});}
		textfield.setValue(val);
	}
});
//ihiddenfield
Ext.define('IHiddenField', {
	alias:'widget.ihiddenfield',
	extend:'Ext.form.Hidden',
	property:{type:'hidden'}
});
//icheckbox
Ext.define('ICheckBox', {
	alias:'widget.icheckbox',
	extend:'Ext.form.Checkbox',
	property:{type:'checkbox'},
	margin:true,
	labelAlign:'right',
	enableKeyEvents:true,
	initComponent:function(){
		var allowBlank='';
		if(this.listeners==undefined){this.listeners=[];}
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBalnk='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.listeners.afterrender=function(checkbox){
			checkbox.getEl().on('keyup', function(evt, t, o) {
				if (evt.getKey() == Ext.EventObject.ENTER) {
					var textfield=Ext.getCmp(this.id);
					nextFocus(textfield,evt);	
				}
			});
		};
		var specialkeyOri=null;
		if(this.listeners.specialkey!=undefined){specialkeyOri=this.listeners.specialkey;}
		var specialkey=function(textfield,e){
			if(specialkeyOri != null){specialkeyOri(textfield,e);}
			if(e.keyCode==13){
				e.preventDefault();				
			}
			return false;
		};
		this.listeners.specialkey=specialkey;
		this.callParent(arguments);
	}
});
//iwindow
Ext.define('IWindow', {
	alias:'widget.iwindow',
	extend : 'Ext.window.Window',
	glyph:'',
	iconCls:'fa fa-desktop',
	constrain : true,
	closeAction : 'hide',
	autoScroll: true,
	resizable : false,
	bodyStyle:'padding-right: -1px;',
	modal : true,
	closing : true,
	q : {type : 'window'},
	full:false,
	layout : 'fit',
	initComponent:function(a){
		var $this=this;
		var listShowOri=null;
		if(this.listeners != undefined && this.listeners.show != undefined){listShowOri=this.listeners.show;}
		if(this.listeners==undefined){this.listeners={};}
		this.listeners.show=function(a) {
			if(listShowOri!=null){listShowOri(a);}
			if (a.qShow != undefined){a.qShow();}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			if($this.maximized == undefined || $this.maximized==false){
				if(_single_page==false){
					if(Ext.getCmp('west-region-container') != undefined && Ext.getCmp('west-region-container').collapsed===false){
						$this.maxWidth=size.width-200;
					}else{
						$this.maxWidth=size.width-32;
					}
					$this.maxHeight=size.height-85;
					// if(Ext.getCmp('header').hidden===true){
						$this.maxHeight=size.height-30;
					// }
					if(_mobile==true){
						$this.maxHeight=size.height-43;
						$this.maxWidth=size.width-2;
					}
				}
			}
			$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').replaceWith('<div class="'+$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').attr('class')+'" id="'+$this.el.id+'_header-iconEl'+'"></div>');
			$this.center();			
		};
		this.listeners.close = function(a) {if (a.qHide != undefined){a.qHide();}};
		this.listeners.beforeclose ={
			fn : function(t) {
				var close = true;
				if (t.qBeforeClose != undefined && t.closing == false){close = t.qBeforeClose();}
				if (close == true && t.closing == true){return true;}else{return false;}
			}
		};
		this.callParent(arguments);
		var size = {
			width: window.innerWidth || document.body.clientWidth,
			height: window.innerHeight || document.body.clientHeight
		};
		if($this.maximized == undefined || $this.maximized==false){
			if(_single_page==false){
				if(Ext.getCmp('west-region-container') != undefined && Ext.getCmp('west-region-container').collapsed===false){
					$this.maxWidth=size.width-200;
				}else{
					$this.maxWidth=size.width-32;
				}
				$this.maxHeight=size.height-85;
				// if(Ext.getCmp('header').hidden===true){
					$this.maxHeight=size.height-30;
					// }
				if(_mobile==true){
					$this.maxHeight=size.height-43;
					$this.maxWidth=size.width-2;
				}
			}
		}
	},
	qClose : function() {
		this.closing = true;
		this.close();
	}
});
//iconfirm
Ext.define('IConfirm', {
	alias:'widget.iconfirm',
	extend : 'Ext.window.Window',msg : '',title :'Konfirmasi',constrain : true,bodyStyle : 'background:transparent;padding: 5px;',q : {type : 'confirm'},modal : true,als : '',
	closeAction : 'hide',resizable : false,minWidth : 200,maxWidth : 350,autoWidth : true,border : false,allow : [],
	confirm : function(dat) {
		var item=this.items.items[1],datAllow=this.allow[dat.allow];
		item.setValue(false);
		item.hide();
		this.als = '';
		if (dat.msg != undefined){this.items.items[0].items.items[1].setValue(dat.msg);}
		if (dat.onY != undefined){this.onY = dat.onY;}
		if (dat.onN != undefined){this.onN = dat.onN;}
		if (dat.allow != undefined) {
			if (datAllow == undefined){datAllow = false;}
			if (datAllow == false) {
				this.als = dat.allow;
				item.show();
				this.show();
			}else{if(this.onY != undefined){this.close();this.onY();}}
		}else{this.show();}
	},
	listeners : {show : function(a) {a.center();Ext.getCmp(a.id+'btnYes').focus();}},
	initComponent : function() {
		var $this = this;
		$this.items = [
			{
				xtype:'panel',
				bodyStyle : 'background:transparent;',border:false,
				layout : {type : 'hbox',align : 'stretch'},
				items : [
					{ html:'<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf059;</div>&nbsp;',style:'padding-right: 5px;',cls:'i-transparent',border:false
					}, {xtype : 'displayfield',style : 'margin-top:10px;margin-right:10px;',maxWidth : 280,value : $this.msg}
				]
			}, {xtype:'checkbox',style : 'margin-left: 10px;',boxLabel : 'do not ask again.'}
		];
		$this.fbar = [
			{
				xtype:'button',
				id:$this.id+'btnYes',
				text : 'Yes',
				iconCls : 'fa fa-check fa-green',
				handler : function() {
					$this.close();
					if ($this.als != '' && $this.items.items[1].getValue() == true){$this.allow[$this.als] = true;}
					if ($this.onY != undefined){$this.onY();}
				}
			},{
				xtype:'button',
				text : 'No',
				iconCls : 'fa fa-close fa-red',
				handler : function() {$this.close();if ($this.onN != undefined){$this.onN();}}
			}
		];
		$this.callParent(arguments);
	}
});
//ibuttonnewtab
Ext.define('IButtonNewTab', {
	alias:'widget.ibuttonnewtab',
	extend : 'Ext.Button',
	tooltip:'Pindah Tab',
	iconCls:'fa fa-window-restore',
	handler:function(){lib.newTabMenu();},
	initComponent:function(a){if(_single_page==true){this.hidden=true;}this.callParent();if(_mobile==true){this.hide();}}

});
//ibuttonfullscreen
Ext.define('IButtonFullScreen', {
	alias:'widget.ibuttonfullscreen',
	extend : 'Ext.Button',
	tooltip:'Full Screen/Not Full Screen <b>[F11]</b>',
	iconCls:'fa-window-maximize',
	allow:false,
	hidden:true,
	handler:function(a){
		var elem=document.body;
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			if (elem.requestFullScreen) {elem.requestFullScreen();
			} else if (elem.mozRequestFullScreen) {elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullScreen) {elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (elem.msRequestFullscreen) {elem.msRequestFullscreen();}
			a.setIconCls('fa fa-window-minimize');
		} else {
			if (document.cancelFullScreen) {document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {ument.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {document.msExitFullscreen();}
			a.setIconCls('fa fa-window-maximize');
		}
	},
	initComponent:function(a){
		if(_single_page==true || this.allow==true){this.hidden=false;}
		this.callParent();
		if(_mobile==true){this.hide();}
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			this.setIconCls('fa fa-window-maximize');
		}else{this.setIconCls('fa fa-window-minimize');}
	}
});
//itoast
Ext.define('IToast', {
	alias:'widget.itoast',
	iconCls:null,
	extend:"IWindow",
	header: false,
	border:0,
	modal:!1,
	xtype:"toast",
	isToast:!0,
	cls:Ext.baseCSSPrefix+"toast",
	bodyPadding:10,
	padding:0,
	title:"Info",
	autoClose:!0,
	plain:!1,
	draggable:!1,
	resizable:!1,
	shadow:!1,
	focus:Ext.emptyFn,
	anchor:null,useXAxis:!1,
	bodyStyle:'background:white;',
	autoHeight:!0,align:"tr",animate:!0,msg:"",spacing:6,paddingX:30,layout:{type:"hbox",align:"stretch"},paddingY:10,slideInAnimation:"easeIn",slideBackAnimation:"bounceOut",slideInDuration:1500,slideBackDuration:1e3,hideDuration:500,autoCloseDelay:3e3,stickOnClick:!0,stickWhileHover:!0,closeOnMouseDown:!1,isHiding:!1,isFading:!1,destroyAfterHide:!1,closeOnMouseOut:!1,xPos:0,yPos:0,maxWidth:350,
	toast:function(i){void 0!=i.msg&&this.items.items[1].setValue(i.msg),void 0!=i.type?"warning"==i.type?(this.title="Peringatan",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #ff9800 !important;">&#xf071;</div>&nbsp;')):"error"==i.type?(this.title="Kesalahan",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #f44336 !important;">&#xf057;</div>&nbsp;')):"privilege"==i.type?(this.title="Hak Istimewa",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #2196F3 !important;">&#xf091;</div>&nbsp;')):"success"==i.type&&(this.title="Sukses",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #4CAF50 !important;">&#xf058;</div>&nbsp;')):(this.title="Informasi",this.items.items[0].update('<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #2196F3 !important;">&#xf05a;</div>&nbsp;')),this.show(),this.setHeight(this.items.items[1].getHeight()+30),Ext.WindowManager.bringToFront(this);},initComponent:function(){var i=this;
	i.items=[{xtype:'panel',html:'<div class="fa" style="font-family:FontAwesome;font-size:50px !important;color: #2196F3 !important;">&#xf059;</div>&nbsp;',cls:'i-transparent',width: 50,border:false},{xtype:"displayfield",style:"margin-top:5px;margin-right:10px;margin-left:10px;color:#9f6000 !important;",maxWidth:280,autoHeight:!0,value:i.msg}],i.updateAlignment(i.align),i.setAnchor(i.anchor),i.callParent()},onRender:function(){var i=this;i.callParent(arguments),i.el.hover(i.onMouseEnter,i.onMouseLeave,i),i.closeOnMouseDown&&Ext.getDoc().on("mousedown",i.onDocumentMousedown,i)},alignmentProps:{br:{paddingFactorX:-1,paddingFactorY:-1,siblingAlignment:"br-br",anchorAlign:"tr-br"},bl:{paddingFactorX:1,paddingFactorY:-1,siblingAlignment:"bl-bl",anchorAlign:"tl-bl"},tr:{paddingFactorX:-1,paddingFactorY:1,siblingAlignment:"tr-tr",anchorAlign:"br-tr"},tl:{paddingFactorX:1,paddingFactorY:1,siblingAlignment:"tl-tl",anchorAlign:"bl-tl"},b:{paddingFactorX:0,paddingFactorY:-1,siblingAlignment:"b-b",useXAxis:0,anchorAlign:"t-b"},t:{paddingFactorX:0,paddingFactorY:1,siblingAlignment:"t-t",useXAxis:0,anchorAlign:"b-t"},l:{paddingFactorX:1,paddingFactorY:0,siblingAlignment:"l-l",useXAxis:1,anchorAlign:"r-l"},r:{paddingFactorX:-1,paddingFactorY:0,siblingAlignment:"r-r",useXAxis:1,anchorAlign:"l-r"},x:{br:{anchorAlign:"bl-br"},bl:{anchorAlign:"br-bl"},tr:{anchorAlign:"tl-tr"},tl:{anchorAlign:"tr-tl"}}},updateAlignment:function(i){var t=this,n=t.alignmentProps,e=n[i],o=n.x[i];o&&t.useXAxis&&Ext.applyIf(t,o),Ext.applyIf(t,e)},getXposAlignedToAnchor:function(){var i=this,t=i.align,n=i.anchor,e=n&&n.el,o=i.el,s=0;return e&&e.dom&&(i.useXAxis?"br"===t||"tr"===t||"r"===t?(s+=e.getAnchorXY("r")[0],s-=o.getWidth()+i.paddingX):(s+=e.getAnchorXY("l")[0],s+=i.paddingX):s=o.getLeft()),s},getYposAlignedToAnchor:function(){var i=this,t=i.align,n=i.anchor,e=n&&n.el,o=i.el,s=0;return e&&e.dom&&(i.useXAxis?s=o.getTop():"br"===t||"bl"===t||"b"===t?(s+=e.getAnchorXY("b")[1],s-=o.getHeight()+i.paddingY):(s+=e.getAnchorXY("t")[1],s+=i.paddingY)),s},getXposAlignedToSibling:function(i){var t,n=this,e=n.align,o=n.el;return t=n.useXAxis?"tl"===e||"bl"===e||"l"===e?i.xPos+i.el.getWidth()+i.spacing:i.xPos-o.getWidth()-n.spacing:o.getLeft()},getYposAlignedToSibling:function(i){var t,n=this,e=n.align,o=n.el;return t=n.useXAxis?o.getTop():"tr"===e||"tl"===e||"t"===e?i.yPos+i.el.getHeight()+i.spacing:i.yPos-o.getHeight()-i.spacing},getToasts:function(){var i=this.anchor,t=this.anchorAlign,n=i.activeToasts||(i.activeToasts={});return n[t]||(n[t]=[])},setAnchor:function(i){var t,n=this;n.anchor=i="string"==typeof i?Ext.getCmp(i):i,i||(t=IToast,n.anchor=t.bodyAnchor||(t.bodyAnchor={el:Ext.getBody()}))},beforeShow:function(){var i=this;i.stickOnClick&&i.body.on("click",function(){i.cancelAutoClose()}),i.autoClose&&(i.closeTask||(i.closeTask=new Ext.util.DelayedTask(i.doAutoClose,i)),i.closeTask.delay(i.autoCloseDelay)),i.el.setX(-1e4),i.el.setOpacity(1)},afterShow:function(){var i,t,n,e,o=this,s=o.el;o.callParent(arguments),i=o.getToasts(),n=i.length,t=n&&i[n-1],t?(s.alignTo(t.el,o.siblingAlignment,[0,0]),o.xPos=o.getXposAlignedToSibling(t),o.yPos=o.getYposAlignedToSibling(t)):(s.alignTo(o.anchor.el,o.anchorAlign,[o.paddingX*o.paddingFactorX,o.paddingY*o.paddingFactorY],!1),o.xPos=o.getXposAlignedToAnchor(),o.yPos=o.getYposAlignedToAnchor()),Ext.Array.include(i,o),o.animate?(e=s.getXY(),s.animate({from:{x:e[0],y:e[1]},to:{x:o.xPos,y:o.yPos,opacity:1},easing:o.slideInAnimation,duration:o.slideInDuration,dynamic:!0})):o.setLocalXY(o.xPos,o.yPos)},onDocumentMousedown:function(i){this.isVisible()&&!this.owns(i.getTarget())&&this.hide()},slideBack:function(){var i=this,t=i.anchor,n=t&&t.el,e=i.el,o=i.getToasts(),s=Ext.Array.indexOf(o,i);!i.isHiding&&e&&e.dom&&n&&n.isVisible()&&(s?(i.xPos=i.getXposAlignedToSibling(o[s-1]),i.yPos=i.getYposAlignedToSibling(o[s-1])):(i.xPos=i.getXposAlignedToAnchor(),i.yPos=i.getYposAlignedToAnchor()),i.stopAnimation(),i.animate&&e.animate({to:{x:i.xPos,y:i.yPos},easing:i.slideBackAnimation,duration:i.slideBackDuration,dynamic:!0}))},update:function(){var i=this;i.isVisible()&&(i.isHiding=!0,i.hide()),i.callParent(arguments),i.show()},cancelAutoClose:function(){var i=this.closeTask;i&&i.cancel()},doAutoClose:function(){var i=this;i.stickWhileHover&&i.mouseIsOver?i.closeOnMouseOut=!0:i.close()},onMouseEnter:function(){this.mouseIsOver=!0},onMouseLeave:function(){var i=this;i.mouseIsOver=!1,i.closeOnMouseOut&&(i.closeOnMouseOut=!1,i.close())},removeFromAnchor:function(){var i,t,n=this;if(n.anchor&&(i=n.getToasts(),t=Ext.Array.indexOf(i,n),-1!==t))for(Ext.Array.erase(i,t,1);t<i.length;t++)i[t].slideBack()},getFocusEl:Ext.emptyFn,hide:function(){var i=this,t=i.el;return i.cancelAutoClose(),i.isHiding?i.isFading||(i.callParent(arguments),i.removeFromAnchor(),i.isHiding=!1):(i.isHiding=!0,i.isFading=!0,i.cancelAutoClose(),t&&(i.animate?t.fadeOut({opacity:0,easing:"easeIn",duration:i.hideDuration,listeners:{afteranimate:function(){i.isFading=!1,i.hide(i.animateTarget,i.doClose,i)}}}):(i.isFading=!1,i.hide(i.animateTarget,i.doClose,i)))),i}
});
//iradio
Ext.define('IRadio', {
	alias:'widget.iradio',
	extend:'Ext.form.Radio',
	property:{type:'radio'},
	margin:true,
	labelAlign:'right',
	enableKeyEvents:true,
	initComponent:function(){
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBalnk='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.listeners.afterrender=function(checkbox){
			checkbox.getEl().on('keyup', function(evt, t, o) {
				if (evt.getKey() == Ext.EventObject.ENTER) {
					var textfield=Ext.getCmp(this.id);
					nextFocus(textfield,evt);	
				}
			});
		};
		var specialkeyOri=null;
		if(this.listeners.specialkey!=undefined){specialkeyOri=this.listeners.specialkey;}
		var specialkey=function(textfield,e){
			if(specialkeyOri != null){specialkeyOri(textfield,e);}
			if(e.keyCode==13){
				e.preventDefault();				
			}
			return false;
		};
		this.callParent(arguments);
	}
});
//idisplayfield
Ext.define('IDisplayField', {
	alias:'widget.idisplayfield',
	extend: 'Ext.form.DisplayField',
	property:{},
	press:{},
	event:{},
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='displayfield';
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+'</span>';		
		}
		this.callParent(arguments);
	}
});
//isession
Ext.define('ISession', {
	extend : 'Ext.Window',
	title : 'Login - Session Has Expired.',
	closable : false,
	id:'session',
	modal : true,
	iconCls: 'fa fa-user',
	closeAction:'destroy',
	fbar: [{
		text: 'Login',
		iconCls:'fa fa-user',
		id:'a8.input.btnLogin',
		handler: function() {
			var param={username:Ext.getCmp('session.f1').getValue(),password:Ext.getCmp('session.f2').getValue()};
			Ext.getCmp('session').setLoading(true);
			Ext.Ajax.request({
				url : url + 'fn/login/login',
				method : 'POST',
				params:param,
				success : function(response) {
					if(Ext.getCmp('session') != undefined)
						Ext.getCmp('session').setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						if(_user_code != param.username){location.replace(url+'page/'+r.d);}
						//storage_auth();
						_session_id=r.d;
						window.history.pushState({canBeAnything:true},"Ayam",url+'page/'+r.d);
						Ext.getCmp('session').close();
						for(var i=0,iLen=_listAjaxSession.length; i<iLen;i++){Ext.Ajax.request(_listAjaxSession[i].request.options);}
						_listAjaxSession=[];
						_execAjaxSession=false;
					}
				},
				failure : function(jqXHR, exception) {
					if(Ext.getCmp('session') != undefined)
						Ext.getCmp('session').setLoading(false);
					ajaxError(jqXHR, exception);
				}
			});
		}
	},{
		text: 'Halaman Login',
		iconCls:'fa fa-file-o',
		handler: function() {Ext.getCmp('main.confirm').confirm({msg : 'Apakah Kamu Ingin Ke Halaman Login?',onY : function(){location.replace(url+'page/login');}});}
	}],
	initComponent:function(){
		var $this=this;
		$this.items=[
			Ext.create('IPanel',{
				bodyStyle : 'padding: 5px 10px',
				width: 350,
				items:[
					{
						xtype:'itextfield',
						fieldLabel:'Username',
						id:'session.f1',
						press:{enter:function(){_click('a8.input.btnLogin');}},
						allowBlank: false
					},{
						xtype:'itextfield',
						fieldLabel:'Password',
						inputType: 'password' ,
						press:{enter:function(){_click('a8.input.btnLogin');}},
						id:'session.f2',
						allowBlank: false
					}
				]
			})
		];
		$this.callParent();
	}
});
