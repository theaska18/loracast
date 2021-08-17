Ext.define('App.system.Main', {
	extend : 'Ext.container.Viewport',
	layout : {type : 'vbox',align : 'stretch'},
	id:'main',
	loadMenu : function(a) {
		var $this = this,mainTab=Ext.getCmp('main.tab'+ a.code),mainBody=Ext.getCmp('main.body'),mainTabEl=null;
		if (mainTab == undefined ||(mainTab != undefined && mainTab.items.items.length==0)){$this.addTab(a);}else{
			if(mainTab.closing == false){mainBody.setActiveTab(mainTab);}else{
				mainBody.add(mainTab);
				mainTabEl=mainTab.getEl();mainTabEl.setOpacity(0);mainTabEl.fadeIn({duration: 1000});
				mainTab.closing = false;
				mainBody.setActiveTab(mainTab);
				var role={code:a.code,text:a.text,update:a.update,icon:a.icon},ses=_get_session(session_name),tab_list=ses.list[ses.user_id].tab_list;ada=false;
				for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break;}}
				if(ada===false){
					tab_list.push(role);
					_tab_list=tab_list;
					_set_session(session_name,ses);
				}
			}
		}
	},
	addTab : function(r,closable) {
		var $this = this,mainTab=null,mainBody=Ext.getCmp('main.body'),txt=r.text,mainTabEl=null;
		if(Ext.getCmp('main.tab'+ r.code)==undefined){
			if(closable==undefined){closable=true}
			mainBody.add({
				title : txt,id : 'main.tab' + r.code,code : r.code,iconCls: r.icon,closable : closable,border:false,closing : false,closeAction : 'hide',layout : 'fit',
				listeners : {
					activate:function(a){
						var ses=_get_session(session_name);
						ses.focusTab=a.id
						_set_session(session_name,ses);
						if(_mobile==true){
							Ext.getCmp('lable').setText(r.text);
							Ext.getCmp('btnHome').show();
							Ext.getCmp('boxImage').hide();
						}
						var btnMenu=$('#menu-notice-'+a.code);btnMenu.attr('stop',true);btnMenu.fadeOut(500);btnMenu.hide();btnMenu.html('');
						if(_var.notificationList != undefined){
							for(var i=0,iLen=_var.notificationList[a.code].length;i<iLen;i++){
								Ext.Ajax.request({
									url : url + 'cmp/setNotif',
									method : 'POST',
									params:{id:_var.notificationList[a.code][i]},
									success : function(response) {
										var r = ajaxSuccess(response);
										if (r.r == 'S'){}
									},
									failure : function(jqXHR, exception){ajaxError(jqXHR, exception,true);}
								});
							}
						}
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
											var ses=_get_session(session_name),tab_list=ses.list[ses.user_id].tab_list;
											for(var i=0,iLen=tab_list.length;i<iLen; i++){
												if(tab_list[i].code==role.code){
													tab_list.splice(i,1);
													_tab_list=tab_list;
													_set_session(session_name,ses);
													break;
												}
											}
											Ext.getCmp('main.tab'+ t.code).closing = true;
											mainBody.remove(t);
										}
									});
								}else{Ext.create('App.cmp.Toast').toast({msg : 'Mohon Tutup Semua Window yang ada di tab '+t.title+'.',type : 'information'});}
								return false;
							}else{return true;}
						}
					}
				}
			});
		}else{mainBody.add(Ext.getCmp('main.tab'+ r.code));}
		mainTab=Ext.getCmp('main.tab' + r.code);
		mainBody.setActiveTab(mainTab);
		var ses=_get_session(session_name),role={code:r.code,text:txt,update:r.update,icon:r.icon};
		if(_cache=='N' || (_cache=='Y' && ses.mod[role.code]==undefined) || (_cache=='Y' && ses.mod[role.code]!= undefined && ses.mod[role.code]['update']!=role.update)){
			Ext.Ajax.request({
				url : url + 'cmd/js',
				method : 'GET',
				params : {m : r.code},
				before:function(){mainTab.setLoading(true);},
				success : function(response) {
					mainTab.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S' && r.d.script !=='') {
						ses.mod[role.code]={update:role.update,coding:r.d.script,init:r.d.init,language:JSON.parse(r.d.language)};
						_lang[role.code]=JSON.parse(r.d.language);
						mainTab.add(eval(r.d.script));
						mainTabEl=mainTab.getEl();if(mainTabEl !== undefined){mainTabEl.setOpacity(0);mainTabEl.fadeIn({duration: 1000});}
						var	tab_list=ses.list[ses.user_id].tab_list;
						ada=false;
						for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break;}}
						if(ada===false){
							tab_list.push(role);
							_tab_list=tab_list;
							_set_session(session_name,ses);
						}
						for(var i=0, iLen=_access_list.length; i<iLen;i++){
							var o=_access_list[i];
							if(o.acces_type=='ACCESSTYPE_ID'){
								var cmp=Ext.getCmp(o.access_code);
								if(cmp != undefined && cmp.enable != undefined){cmp.disable();}
							}
						}
						var closable=true;
						eval(r.d.init);
						Ext.getCmp('main.tab' + role.code).tab.setClosable(closable);
					}else if(r.r !== 'S' && r.r !== 'F' && r.r !== 'P'){
						mainTab.closing=true;
						mainBody.remove(mainTab);
						Ext.create('App.cmp.Toast').toast({msg : 'Modul tidak sempurna, Harap hubungi Admin.',type : 'error'});
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
			_lang[role.code]=ses.mod[role.code].language;
			mainTab.add(eval(ses.mod[role.code].coding));
			mainTabEl=mainTab.getEl();
			if(mainTabEl != null){mainTabEl.setOpacity(0);mainTabEl.fadeIn({duration: 1000});}
			var	tab_list=ses.list[ses.user_id].tab_list;
			ada=false;
			for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;break}}
			if(ada===false){
				tab_list.push(role);
				_tab_list=tab_list;
				_set_session(session_name,ses);
			}
			for(var i=0, iLen=_access_list.length; i<iLen;i++){
				var o=_access_list[i];
				if(o.acces_type=='ACCESSTYPE_ID'){
					var cmp=Ext.getCmp(o.access_code);
					if(cmp != undefined && cmp.enable != undefined){cmp.disable();}
				}
			}
			var closable=true;
			eval(ses.mod[role.code].init);
			Ext.getCmp('main.tab' + role.code).tab.setClosable(closable);
		}
	},
	items : [
		{
			xtype:'panel',
			id:'header',
			hidden:iif(_mobile==true,true,false),
			html:iif(_mobile==false,'<div class="i-top-banner">' +
				'<img class="i-top-image" src="'+url+'vendor/images/logo_175_50.png">' +
				'<div class="i-top-right">'+
					'<div class="i-top-image-profile" id="btnMenuOther" style="background-image: url('+url+"upload/"+_tenant_logo+');"></div>'+
					// '<span class="i-top-image-notif fa fa-bars" id="btnMenuNotif" ></span>'+
				'</div></div>',''),
			height: 58,
			border:false
		},{
			xtype:'panel',
			hidden:iif(_mobile==true,false,true),
			id:'headerMobile',  
			tbar:iif(_mobile==true,[
				{
					iconCls:'fa fa-home',
					id:'btnHome',
					hidden:true,
					handler:function(a){
						Ext.getCmp('west-region-container').hide();
						Ext.getCmp('lable').setText('');
						Ext.getCmp('main.body').setActiveTab(Ext.getCmp('main.tab.home'));
						Ext.getCmp('boxImage').show();
						a.hide();
					}
				},
				{xtype: 'box',id:'boxImage',autoEl: {tag: 'img', style:'height: 40px;margin-top:-10px;',src:''+url+'vendor/images/logo_154_40.png'}},
				'->',{xtype: 'tbtext',text:'',style:'font-weight:bold;',id:'lable'},'->',
				{
					id:'btnProfile',
					border:false,
					width: 25,
					height: 25,
					style:'background-image: url('+url+"upload/"+_tenant_logo+');background-size: 100%;',
					handler:function(){
						var me=Ext.getCmp('windowMenu');
						if(me.isVisible()) {
							$('#i-window-menu-other-cursor').hide();
							me.hide();
						}else{
							$('#i-window-menu-other-cursor').show();
							Ext.getCmp('west-region-container').hide();
							me.show(); 
						}
					}
				},{
					iconCls:'fa fa-list',
					id:'btnMenu',
					handler:function(){
						Ext.getCmp('west-region-container').getEl().setStyle('z-index','80000');
						if(Ext.getCmp('west-region-container').isVisible()==true){Ext.getCmp('west-region-container').hide();
						}else{Ext.getCmp('west-region-container').show();}
					}
				}
			],[]),
			height: 43,
			border:false
		},{
			xtype:'panel',
			layout: 'border',
			style:iif(_mobile==true,'','margin-top: -1px;margin-bottom: -1px;'),
			flex:1,
			bodyBorder: false,
			items: [{
		        region:'west',
		        style : iif(_mobile==true,{},{'margin-top' : '-1px','margin-bottom' : '-1px','margin-left' : '-1px'}),
		        xtype: 'panel',
		        width: iif(_mobile==true,'100%',200),
		        collapsible:iif(_mobile==true,false,true),
		        id: 'west-region-container',
				listeners: {
					collapse: function() {
						var ses=_get_session(session_name);
						ses.list[ses.user_id].collapse=true;
						_set_session(session_name,ses);
					},
					expand: function() {
						var ses=_get_session(session_name);
						ses.list[ses.user_id].collapse=false;
						_set_session(session_name,ses);
					}
				},
				layout: 'fit',
		        items:[
					{
						xtype:'treepanel',
						rootVisible: false,
						id:'main.menu',
						cls:'i-menu',
						style : {'margin-top' : '-2px'},
						border:false,
						hideHeaders:true,
						flex:1,
						listeners: {
							itemclick: function(s,r) {
								var r=r.raw;
								if(r.leaf==true && r.code != undefined){
									if(_mobile==true){
										Ext.getCmp('west-region-container').hide();
										Ext.getCmp('boxImage').hide();
										Ext.getCmp('btnHome').show();
									}
									var result = eval('(function() {' + r.load + 'return true;}())');
									if(result){Ext.getCmp('main').loadMenu({text:r.txt,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls});}
								}else if(r.leaf==true && r.code == undefined){r.command();}	
							}
						},
						columns: [{
							xtype: 'treecolumn',
							dataIndex: 'text',
							flex: 1,
							renderer: function (val, meta, rec) {return '<span data-qtip="'+val+'">'+val+'</span>';}
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
						autoDestroy : false,
						flex : 1,
						tabBar: {
							items: [{xtype: 'tbfill'
							}, {xtype:'ibuttonfullscreen',disabled:false},
								{
									xtype:'button',
									iconCls:'fa fa-arrow-up',
									id:'main.btnUp',
									handler:function(a){
										var ses=_get_session(session_name);
										if(Ext.getCmp('header').hidden==true){Ext.getCmp('header').show();a.setIconCls('fa fa-arrow-up');ses.list[ses.user_id].banner=true;
										}else{a.setIconCls('fa fa-arrow-down');Ext.getCmp('header').hide();ses.list[ses.user_id].banner=false;}
										_set_session(session_name,ses);
									},
								}
							]
						},
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
							listeners:{
								activate:function(a){
									var ses=_get_session(session_name);
									ses.focusTab=a.id
									_set_session(session_name,ses);
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
		var $this = this;
		ses=_get_session(session_name);tabSession=ses.list[ses.user_id].tab_list;mainMenu=Ext.getCmp('main.menu');
		var collapse=ses.list[ses.user_id]['collapse'],banner=ses.list[ses.user_id]['banner'];
		if(collapse != undefined && collapse===true && _mobile===false){
			Ext.getCmp('west-region-container').collapse();
		}
		if((banner != undefined && banner===false) || _mobile===true){
			Ext.getCmp('main.btnUp').setIconCls('fa fa-arrow-down');
			Ext.getCmp('header').hide();
		}
		for (var i = 0,iLen=tabSession.length; i <iLen ; i++) {var l = i;$this.addTab(tabSession[l]);}
		mainMenu.store.setRootNode([]);
		var c = mainMenu.store.getRootNode();
		if(_menu_list.length >0){c.insertChild(1,_menu_list);}
		mainMenu.expandAll();
		function getNotif(){
			Ext.Ajax.request({
				url : url + 'cmp/getNotif',
				method : 'GET',
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S'){
						var l=r.d;
						for(var i=0,iLen=l.length; i<iLen;i++){
							if(l[i].menu_code != null && l[i].menu_code != ''){
								if(_var.notification[l[i].menu_code]==true){
									_notif(l[i].title,l[i].message);
									_notice(l[i].menu_code,1);
									if(_mobile==true){
										Ext.Ajax.request({
											url : url + 'cmp/setNotif',
											method : 'POST',
											params:{id:l[i].notification_id},
											success : function(response) {
												var r = ajaxSuccess(response);
												if (r.r == 'S'){}
											},
											failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
										});
									}else{
										_var.notificationList[l[i].menu_code].push(l[i].notification_id);
									}
								}else{
									Ext.Ajax.request({
										url : url + 'cmp/setNotif',
										method : 'POST',
										params:{id:l[i].notification_id},
										success : function(response) {
											var r = ajaxSuccess(response);
											if (r.r == 'S'){}
										},
										failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
									});
								}
							}else{_notif(l[i].title,l[i].message);}
						}
					}
				},
				failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
			});
		}
		getNotif();
		setInterval(function(){getNotif();},300000);
		if(_mobile==true){Ext.getCmp('main.body').getTabBar().hide();}
	}
});