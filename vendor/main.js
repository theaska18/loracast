Ext.define('IMain', {
	alias:'widget.imain',
	extend : 'Ext.container.Viewport',
	layout : {type : 'vbox',align : 'stretch'},
	id:'main',
	bodyBorder: false,
	border: false,
	loadMenuByCode : function(code) {
		var r=_menu_list_obj[code];
		if(_mobile==true){
			Ext.getCmp('west-region-container').hide();
		}
		var result = eval('(function() {' + r.load + 'return true;}())');
		if(result){Ext.getCmp('main').loadMenu(r);}
	},
	loadMenu : function(a) {
		var $this = this,mainTab=Ext.getCmp('main.tab'+ a.code),mainBody=Ext.getCmp('main.body'),mainTabEl=null;
		if(_mobile==true){Ext.getCmp('west-region-container').hide();}
		if (mainTab == undefined ||(mainTab != undefined && mainTab.items.items.length==0)|| 
			_local_storage.mod[a.code] ==undefined ||(_local_storage.mod[a.code]!=undefined && _local_storage.mod[a.code].update!==a.update)){$this.addTab(a);}else{
			if(mainTab.closing == false){mainBody.setActiveTab(mainTab);}else{
				mainBody.add(mainTab);
				mainTab.closing = false;
				mainBody.setActiveTab(mainTab);
				var role={code:a.code,text:a.text,update:a.update,icon:a.icon,qtip:a.qtip},tab_list=_local_storage.list[_local_storage.user_id].tab_list;ada=false;
				for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break;}}
				if(ada===false){
					tab_list.push(role);
					_tab_list=tab_list;
					_set_session(session_name,_local_storage);
				}
			}
		}
	},
	addTab : function(r,closable,callback) {
		var $this = this,mainTab=null,mainBody=Ext.getCmp('main.body'),txt=r.text,mainTabEl=null;
		if(Ext.getCmp('main.tab'+ r.code)==undefined){
			if(closable==undefined){closable=true};
			mainBody.add({
				title : txt,id : 'main.tab' + r.code,code : r.code,iconCls: r.icon,closable : closable,border:false,closing : false,layout : 'fit',qtip:r.qtip,
				listeners : {
					activate:function(a){
						_local_storage.list[_local_storage.user_id].focusTab=a.id
						_set_session(session_name,_local_storage);
						var btnMenu=$('#menu-notice-'+a.code);btnMenu.attr('stop',true);btnMenu.fadeOut(500);btnMenu.hide();btnMenu.html('');
					},
					beforeclose : {
						fn : function(t) {
							if (t.closing == false) {
								var win = t.query('window'),hidden = true;
								for (var i = 0, iLen = win.length; i < iLen; i++){if (win[i].hidden == false){hidden = false;break;}}
								if (hidden == true){
									Ext.getCmp('main.confirm').confirm({
										msg : 'Apakah Akan Keluar Dari Tab "'+t.title+'" ?',
										allow : 'main.close.tab',
										onY : function() {
											var tab_list=_local_storage.list[_local_storage.user_id].tab_list;
											for(var i=0,iLen=tab_list.length;i<iLen; i++){
												if(tab_list[i].code==role.code){
													tab_list.splice(i,1);
													_tab_list=tab_list;
													_set_session(session_name,_local_storage);
													break;
												}
											}
											Ext.getCmp('main.tab'+ t.code).closing = true;
											mainBody.remove(t);
										}
									});
								}else{Ext.create('IToast').toast({msg : 'Mohon Tutup Semua Window yang ada di tab '+t.title+'.',type : 'information'});}
								return false;
							}else{return true;}
						}
					}
				}
			});
		}else{mainBody.add(Ext.getCmp('main.tab'+ r.code));}
		mainTab=Ext.getCmp('main.tab' + r.code);
		mainBody.setActiveTab(mainTab);
		var role={qtip:r.qtip,code:r.code,text:txt,update:r.update,icon:r.icon};
		if(_cache=='N' || (_cache=='Y' && _local_storage.mod[role.code]==undefined) || (_cache=='Y' && _local_storage.mod[role.code]!= undefined &&
			(_local_storage.mod[role.code]['update']==undefined ||(_local_storage.mod[role.code]['update'] != undefined && _local_storage.mod[role.code]['update']!=role.update)))){
			Ext.Ajax.request({
				url : url + 'cmd/js',
				method : 'GET',
				params : {m : r.code},
				before:function(){mainTab.setLoading(true);},
				success : function(response) {
					mainTab.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S' && r.d.script !=='') {
						_local_storage.mod[role.code]={imports:r.d.imports,update:role.update,coding:r.d.script,init:r.d.init,language:JSON.parse(r.d.language)};
						_lang[role.code]=JSON.parse(r.d.language);
						mainTab.setLoading(true);
						importComponent(r.d.imports,function(){
							mainTab.setLoading(false);
							mainTab.add(eval(r.d.script));
							var	tab_list=_local_storage.list[_local_storage.user_id].tab_list;
							ada=false;
							for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break;}}
							if(ada===false){
								tab_list.push(role);
								_tab_list=tab_list;
							}
							_set_session(session_name,_local_storage);
							for(var i=0, iLen=_access_list.length; i<iLen;i++){
								var o=_access_list[i];
								if(o.acces_type=='ACCESSTYPE_ID'){
									var cmp=Ext.getCmp(o.access_code);
									if(cmp != undefined){cmp.hide();}
								}
							}
							var closable=true;
							eval(r.d.init);
							Ext.getCmp('main.tab' + role.code).tab.setClosable(closable);
							if(callback != undefined){
								callback();
							}
						});
					}else if(r.r !== 'S' && r.r !== 'F' && r.r !== 'P'){
						mainTab.closing=true;
						mainBody.remove(mainTab);
						Ext.create('IToast').toast({msg : 'Modul tidak sempurna, Harap hubungi Admin.',type : 'error'});
					}else if(r.r !== 'F'){mainTab.closing=true;mainBody.remove(mainTab);}
				},
				failure : function(jqXHR, exception) {
					mainTab.setLoading(false);
					if(ajaxError(jqXHR, exception,true)!==0){
						mainTab.closing=true;
						mainBody.remove(mainTab);
					}
				}
			});
		}else{
			var mod=_local_storage.mod[role.code];
			_lang[role.code]=mod.language;
			console.log(mod.imports);
			importComponent(mod.imports,function(para,param2){
				mainTab.add(eval(_local_storage.mod[role.code].coding));
				var	tab_list=_local_storage.list[_local_storage.user_id].tab_list;
				ada=false;
				for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break}}
				if(ada===false){
					tab_list.push(role);
					_tab_list=tab_list;
					_set_session(session_name,_local_storage);
				}
				for(var i=0, iLen=_access_list.length; i<iLen;i++){
					var o=_access_list[i];
					if(o.acces_type=='ACCESSTYPE_ID'){
						var cmp=Ext.getCmp(o.access_code);
						if(cmp != undefined){cmp.hide();}
					}
				}
				var closable=true;
				eval(_local_storage.mod[role.code].init);
				Ext.getCmp('main.tab' + role.code).tab.setClosable(closable);
				if(callback != undefined){
					callback();
				}
			},null);
		}
	},
	items : [
		{
			xtype:'panel',
			layout: 'border',
			style:iif(_mobile==true,'','margin-top: -1px;margin-bottom: -1px;'),
			flex:1,
			id:'main.container',
			tbar:{
				xtype: 'toolbar',
				hidden:true,
				height: iif(_mobile,42,35),
				cls:'i-menu-top',
				border:true,
				id : 'main.tab',
			},
			bodyBorder: false,
			border:false,
			items: [{
		        region:'west',
		        // style : iif(_mobile==true,{},{'margin-top' : '-1px','margin-bottom' : '-1px','margin-left' : '-1px'}),
		        xtype: 'panel',
		        width: iif(_mobile==true,'100%',250),
		        id: 'west-region-container',
				autoScroll:true,
				border:false,
				headerBorder: false,
				bodyBorder: false,
				layout:'fit',
				bodyCls:'i-body-left',
				// tbar:{
					// xtype: 'toolbar',
					// height: 35,
					// cls:'i-menu-top',
					// border:true,
					// items:[{
							// xtype:'label',text:' '+_tenant_name,style:"font-size: 13px;color:white;font-weight:bold;"
						// },'->',
						// {
							// iconCls:'fa fa-bars',
						// }
					// ],
				// },
		        items:[
					// {
						// xtype:'panel',
						// height: 33,
						// border:false,
						// bodyBorder:false,
						// bodyCls:'i-logo-container',
						// html:'<div style="background-image: url('+url+"upload/"+_tenant_logo+');width: 100%;height: 200%;background-size: cover;background-position-x: center;background-repeat: no-repeat;background-position-y: center;"></div><div style="position: absolute;top: 0px;padding: 9px;left: 0px;right: 0px;background-color: rgb(39,42,43,0.5);font-weight:bold;text-shadow: 0 1px 0 black;color: white;">'+_tenant_name+'<a href="javascript: Ext.getCmp(\'west-region-container\').hide();Ext.getCmp(\'btnShowMenu\').show();_local_storage.list[_local_storage.user_id].collapse=true;_set_session(session_name,_local_storage);"><span class="fa fa-arrow-circle-left" style="color: white !important;float: right;cursor:pointer;"></span></a></div>'
					// },
					{
						xtype:'treepanel',
						rootVisible: false,
						id:'main.menu',
						cls:'i-menu',
						bodyCls:'i-menu',
						border:false,
						hideHeaders:true,
						bodyBorder:false,
						flex:1,
						columns: [{
							xtype: 'treecolumn',
							dataIndex: 'text',
							flex: 1,
						}]
					},
				]
		    },{
		        region: 'center', 
		        xtype: 'panel',
		        layout: 'fit',
		        border:false,
			    items:[
			    	{
						xtype:'tabpanel',
						id : 'main.body',
						autoDestroy : true,
						flex : 1,
						scrollable : false,
						autoScroll : false,
						border:false,
						layout : 'fit',
						items : {
							xtype:'panel',
							id:'main.tab.home',
							iconCls : 'fa fa-home',
							layout:'column',
							border:false,
							autoScroll: true,
							bodyStyle:"background-image: url('"+url+"vendor/images/bg-big.png'),url('"+url+"vendor/images/bg-big-bottom.png');background-position: left top, right bottom;background-repeat: no-repeat, no-repeat;",
							listeners:{
								activate:function(a){
									_local_storage.list[_local_storage.user_id].focusTab=a.id
									_set_session(session_name,_local_storage);
								}
							}
						}
					}
			    ]
			},{
				xtype: 'panel',
				hidden:true,
				id : 'main.view',
				region: 'east',
				split: iif(_mobile==true,false,true),
				border:false,
				width: iif(_mobile==true,'100%',400),
				html:'awdwd',
				tbar:[
					'->',{
						iconCls:'fa fa-close',
						tooltip:'Close View',
						handler:function(){Ext.getCmp('main.view').hide();}
					}
				]
			}]
		},{xtype:'iconfirm',id : 'main.confirm'}
    ],
	initComponent : function() {
		this.callParent(arguments);
		var focusTab=_local_storage.list[_local_storage.user_id].focusTab,
			$this = this,
			mainBody=Ext.getCmp('main.body');
		mainBody.getTabBar().hide();
		tabSession=_local_storage.list[_local_storage.user_id].tab_list;
		mainMenu=Ext.getCmp('main.menu');
		var banner=_local_storage.list[_local_storage.user_id]['banner'];
		//mainBody.getComponent(0).tab.hide();
		mainMenu.store.setRootNode([]);
		var c = mainMenu.store.getRootNode(),menu=Ext.getCmp('main.tab');
		if(_mobile==true){
			menu.add(' ');
			menu.add({
				xtype:'label',text:_tenant_name,style:"font-size: 13px;color:white;font-weight:bold;"
			});
			menu.add('->');
		}
		menu.add({
			id:'btnShowMenu',
			text:'<span class="fa fa-bars"></span>',
			listeners: {
				click: function() {
					if(Ext.getCmp('west-region-container').isVisible()){
						Ext.getCmp('west-region-container').hide();
						_local_storage.list[_local_storage.user_id].collapse=true;
					}else{
						Ext.getCmp('west-region-container').show();
						_local_storage.list[_local_storage.user_id].collapse=false;
					}
					_set_session(session_name,_local_storage);
				}
			}
		});
		if(_mobile==false){
			menu.add({
				xtype:'label',text:' '+_tenant_name,style:"font-size: 13px;color:white;font-weight:bold;"
			});
			menu.add('->');
		}else{
			menu.add({
				id:'btnShowHome',
				title:'Home',
				hidden:true,
				text:'<span class="fa fa-home"></span>',
				listeners: {
					click: function() {
						Ext.getCmp('west-region-container').hide();
						Ext.getCmp('main.body').setActiveTab(Ext.getCmp('main.tab.home'));
					}
				}
			});
		}
		var menuRight;
		function renderingMenu(listMenu){
			var menu_list_render=[],menu_render=null;
			for(var i=0,iLen=listMenu.length;i<iLen;i++){
				menu_render=listMenu[i];
				var ObjL={}, hide=false,label='',autoTab=false;
				ObjL.raw=menu_render
				menu_render.qtip=menu_render.text;
				menu_render.text="<span class='"+menu_render.iconCls+"'></span>&nbsp;"+menu_render.text;
				if(menu_render.children != undefined){
					menu_render.children=renderingMenu(menu_render.children);
				}else{
					menu_render.text='<span id=\'menu-label-'+menu_render.code+'\'><a href=\'javascript:Ext.getCmp("main").loadMenuByCode("'+menu_render.code+'");\'><span class=\'i-menu-button\' >'+menu_render.text+'</span></a></span>';
				}
				if(ObjL.raw != undefined){
					label=menu_render.text;
				}
				var notification=true;
				// if(ObjL.childNodes != undefined && ObjL.childNodes != null){_runnable(ObjL.childNodes);}
				if(ObjL.raw.script != undefined && ObjL.raw.script != null){eval(ObjL.raw.script);}
				if(_var.notification == undefined){
					_var.notification={};
					_var.notificationList={};
				}
				_var.notification[ObjL.raw.code]=notification;
				_var.notificationList[ObjL.raw.code]=[];
				if(autoTab==true){
					var r=ObjL.raw;
					if(r.leaf==true && r.code != undefined){
						// if(_mobile==true){
							// Ext.getCmp('west-region-container').hide();
						// }
						var result = eval('(function() {' + r.load + 'return true;}())');
						if(result){
							autoLoad={qtip:r.qtip,text:r.qtip,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls};
						}
					}else if(r.leaf==true && r.code == undefined){r.command();}	
				}
				if(hide==false &&( menu_render.children==undefined || (menu_render.children != undefined && menu_render.children.length>0))){
					menu_render.text=label;
					menu_list_render.push(menu_render);
				}
				_menu_list_obj[menu_render.code]={qtip:menu_render.qtip,text:menu_render.qtip,code:menu_render.code,role:menu_render.role,script:menu_render.script,update:menu_render.update,icon:menu_render.iconCls,load:menu_render.load};
			}
			return menu_list_render;
		}
		function renderingMenuMaster(listMenu){
			var menu_list_render=[],menu_render=null;
			for(var i=0,iLen=listMenu.length;i<iLen;i++){
				menu_render=listMenu[i];
				var ObjL={}, hide=false,label='',autoTab=false;
				ObjL.raw=menu_render;
				menu_render.qtip=menu_render.text;
				if(menu_render.menu != undefined){
					menu_render.menu=renderingMenuMaster(menu_render.menu);
				}else{
					menu_render.text='<span id=\'menu-label-'+menu_render.code+'\'><span>'+menu_render.text+'</span></span>';
				}
				if(ObjL.raw != undefined){
					label=menu_render.text;
				}
				var notification=true;
				// if(ObjL.childNodes != undefined && ObjL.childNodes != null){_runnable(ObjL.childNodes);}
				if(ObjL.raw.script != undefined && ObjL.raw.script != null){eval(ObjL.raw.script);}
				if(_var.notification == undefined){
					_var.notification={};
					_var.notificationList={};
				}
				_var.notification[ObjL.raw.code]=notification;
				_var.notificationList[ObjL.raw.code]=[];
				menu_render.handler=function(a){
					var r=a;
					if(r.leaf==true && r.code != undefined){
						var result = eval('(function() {' + r.load + 'return true;}())');
						if(result){$this.loadMenu({text:r.text,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls,qtip:r.qtip});}
					}else if(r.leaf==true && r.code == undefined){r.command();}	
				};
				if(autoTab==true){
					var r=ObjL.raw;
					if(r.leaf==true && r.code != undefined){
						// if(_mobile==true){
							// Ext.getCmp('west-region-container').hide();
						// }
						var result = eval('(function() {' + r.load + 'return true;}())');
						if(result){
							autoLoad={qtip:r.qtip,text:r.qtip,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls};
						}
					}else if(r.leaf==true && r.code == undefined){r.command();}	
				}
				if(hide==false &&( menu_render.menu==undefined || (menu_render.menu != undefined && menu_render.menu.length>0))){
					menu_render.text=label;
					menu_list_render.push(menu_render);
				}
				// _menu_list_obj[menu_render.code]={text:menu_render.qtip,code:menu_render.code,role:menu_render.role,script:menu_render.script,update:menu_render.update,icon:menu_render.iconCls,load:menu_render.load};
			}
			return menu_list_render;
		}
		var menu_list=[];
		if(_menu_list.length >0){
			var ada=false,menu_obj=null;
			for(var i=0,iLen=_menu_list.length;i<iLen;i++){
				menu_obj=_menu_list[i];
				if(menu_obj != undefined){
					if(menu_obj.master_flag==true){
						// if(ada==true && _mobile==false){menu.add('-');}
						if(_mobile==true){
							menu_obj.text='';
						}
						var ObjL={}, hide=false,label='',autoTab=false;
						ObjL.raw=menu_obj;
						menu_obj.qtip=menu_obj.text;
						// if(_mobile==true){menu_obj.iconCls='';}
						menu_obj.cls='i-menu-top-lbl';
						menu_obj.text="<span class='"+menu_obj.iconCls+"'></span>&nbsp;"+menu_obj.text;
						if(menu_obj.menu != undefined){
							menu_obj.menu=renderingMenuMaster(menu_obj.menu);
						}else{
							menu_obj.text='<span id=\'menu-label-'+menu_obj.code+'\'><span >'+menu_obj.text+'</span></span>';
						}
						if(ObjL.raw != undefined){
							label=menu_obj.text;
						}
						// menu_obj.iconCls=null;
						var notification=true;
						// if(ObjL.childNodes != undefined && ObjL.childNodes != null){_runnable(ObjL.childNodes);}
						if(ObjL.raw.script != undefined && ObjL.raw.script != null){eval(ObjL.raw.script);}
						if(_var.notification == undefined){
							_var.notification={};
							_var.notificationList={};
						}
						_var.notification[ObjL.raw.code]=notification;
						_var.notificationList[ObjL.raw.code]=[];
						menu_obj.handler=function(a){
							var r=a;
							if(r.leaf==true && r.code != undefined){
								var result = eval('(function() {' + r.load + 'return true;}())');
								if(result){$this.loadMenu({text:r.text,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls,qtip:r.qtip});}
							}else if(r.leaf==true && r.code == undefined){r.command();}	
						};
						if(autoTab==true){
							var r=ObjL.raw;
							if(r.leaf==true && r.code != undefined){
								// if(_mobile==true){
									// Ext.getCmp('west-region-container').hide();
								// }
								var result = eval('(function() {' + r.load + 'return true;}())');
								if(result){
									autoLoad={qtip:r.qtip,text:r.qtip,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls};
								}
							}else if(r.leaf==true && r.code == undefined){r.command();}	
						}
						if(hide==false &&( menu_obj.menu== undefined || (menu_obj.menu != undefined && menu_obj.menu.length>0))){
							menu_obj.text=label;
							menu.add(menu_obj);
							_jum_menu_active_top++;
						}
						ada=true;
					}else{
						var ObjL={}, hide=false,label='',autoTab=false;
						ObjL.raw=menu_obj
						menu_obj.qtip=menu_obj.text;
						menu_obj.text="<span class='"+menu_obj.iconCls+"'></span>&nbsp;"+menu_obj.text;
						if(menu_obj.children != undefined){
							menu_obj.children=renderingMenu(menu_obj.children);
							menu_obj.text+='<div class=\'i-menu-hr\'></div>';
						}else{
							menu_obj.text='<span id=\'menu-label-'+menu_obj.code+'\'><a href=\'javascript:Ext.getCmp("main").loadMenuByCode("'+menu_obj.code+'");\'><span class=\'i-menu-button\' >'+menu_obj.text+'</span></a></span>';
						}
						if(ObjL.raw != undefined){
							label=menu_obj.text;
						}
						var notification=true;
						// if(ObjL.childNodes != undefined && ObjL.childNodes != null){_runnable(ObjL.childNodes);}
						if(ObjL.raw.script != undefined && ObjL.raw.script != null){eval(ObjL.raw.script);}
						if(_var.notification == undefined){
							_var.notification={};
							_var.notificationList={};
						}
						_var.notification[ObjL.raw.code]=notification;
						_var.notificationList[ObjL.raw.code]=[];
						if(autoTab==true){
							var r=ObjL.raw;
							if(r.leaf==true && r.code != undefined){
								// if(_mobile==true){
									// Ext.getCmp('west-region-container').hide();
								// }
								var result = eval('(function() {' + r.load + 'return true;}())');
								if(result){
									autoLoad={qtip:r.qtip,text:r.qtip,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls};
								}
							}else if(r.leaf==true && r.code == undefined){r.command();}	
						}
						if(hide==false &&( menu_obj.children== undefined || (menu_obj.children != undefined && menu_obj.children.length>0))){
							menu_obj.text=label;
							menu_list.push(menu_obj);
						}
						_menu_list_obj[menu_obj.code]={qtip:menu_obj.qtip,text:menu_obj.qtip,code:menu_obj.code,role:menu_obj.role,script:menu_obj.script,update:menu_obj.update,icon:menu_obj.iconCls,load:menu_obj.load};
					}
				}
			}
			if(menu_list.length>0){
				c.insertChild(1,menu_list);
			}
		}
		mainMenu.expandAll();
		var collapse=_local_storage.list[_local_storage.user_id]['collapse'];
		if(_show_menu_left==false || _mobile==true || (collapse != undefined && collapse===true && _mobile===false)){
			Ext.getCmp('west-region-container').hide();
		}
		addTabSession(tabSession,0,function(){
			var tabFocus=Ext.getCmp(focusTab);
			if(_show_home==false){
				mainBody.getTabBar().items.items[0].hide();
			}else{
				Ext.getCmp('main.tab.home').show();
				if(_mobile==true){
					Ext.getCmp("btnShowHome").show();
				}
			}
			if(focusTab != undefined && tabFocus != undefined){
				if(focusTab!=='main.tab.home'){
					mainBody.setActiveTab(tabFocus);
				}
			}
			var c = mainMenu.store.getRootNode();
			var menu=Ext.getCmp('main.tab');
			if(c.childNodes.length==0 || _mobile==true){
				Ext.getCmp('west-region-container').hide();
			}
			if(_mobile==true){Ext.getCmp('west-region-container').hide();}
			
			if(_jum_menu_active_top>0 && _show_menu_top==true){
				Ext.getCmp('main.tab').show();
			}
			if(_show_tab_header==true && _mobile==false){
				mainBody.getTabBar().show();
			}
			if(autoLoad!=null){
				$this.loadMenu(autoLoad);
			}
		},$this);
	}
});