Ext.define('IMainSingle', {
	extend : 'Ext.container.Viewport',
	layout : {type : 'vbox',align : 'stretch'},
	id:'main',
	loadMenu : function(a) {
		var $this = this,mainTab=Ext.getCmp('main.tab'+ a.code),mainBody=Ext.getCmp('main.body');
		if (mainTab == undefined){$this.addTab(a);
		}else{
			if (mainTab.closing == false){mainBody.setActiveTab(mainTab);
			}else{
				mainBody.add(mainTab);
				mainTab.closing = false;
				mainBody.setActiveTab(mainTab);
				var role={code:a.code,text:a.text,update:a.update,icon:a.icon},ses=_get_session(session_name),tab_list=menuSession=ses.list[ses.user_id].tab_list;
				ada=false;
			for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;}}
				if(ada===false){
					ses.list[ses.user_id].tab_list.push(role);
					_tab_list=ses.list[ses.user_id].tab_list;
					_set_session(session_name,ses);
				}
			}
		}
	},
	addTab : function(r) {
		var $this = this,mainTab=null,mainBody=Ext.getCmp('main.body');
		mainBody.add({
			title : r.text,
			id : 'main.tab' + r.code,
			code : r.code,
			iconCls: r.icon,
			closable : false,
			closing : false,
			border:false,
			closeAction : 'hide',
			layout : 'fit',
			listeners : {
				beforeclose : {
					fn : function(t) {
						if (t.closing == false) {
							var win = t.query('window'),hidden = true;
							for (var i = 0, iLen = win.length; i < iLen; i++){if (win[i].hidden == false) {hidden = false;break;}}
							if (hidden == true){
								Ext.getCmp('main.confirm').confirm({
									msg : 'Apakah Akan Keluar Dari Tab ""'+t.title+'"" ?',
									allow : 'main.close.tab',
									onY : function() {
										var ses=_get_session(session_name),tab_list=menuSession=ses.list[ses.user_id].tab_list;
										for(var i=0,iLen=tab_list.length;i<iLen; i++){
											if(tab_list[i].code==role.code){
												ses.list[ses.user_id].tab_list.splice(i,1);
												_tab_list=ses.list[ses.user_id].tab_list;
												_set_session(session_name,ses);
												break;
											}
										}
										Ext.getCmp('main.tab'+ t.code).closing = true;
										mainBody.remove(t);
									}
								});
							}else{new Ext.create('App.cmp.Toast').toast({msg : 'Mohon Tutup Semua Window yang ada di tab '+t.title+'.',type : 'information'});}
							return false;
						}else{return true;}
					}
				}
			}
		});
		mainTab=Ext.getCmp('main.tab' + r.code);
		mainBody.setActiveTab(mainTab);
		var ses=_get_session(session_name),role={code:r.code,text:r.text,update:r.update,icon:r.icon};
		if(_cache=='N' || (_cache=='Y' && ses.mod[role.code]==undefined) || (_cache=='Y' && ses.mod[role.code]!= undefined && ses.mod[role.code]['update']!=role.update)){
			mainTab.setLoading('Update Aplikasi.');
			Ext.Ajax.request({
				url : url + 'cmd/js',
				method : 'GET',
				params : {m : r.code},
				success : function(response) {
					mainTab.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						ses.mod[role.code]={update:role.update,coding:r.d.script,init:r.d.init,language:JSON.parse(r.d.language)};
						_lang[role.code]=JSON.parse(r.d.language);
						mainTab.add(eval(r.d.script));
						var	tab_list=menuSession=ses.list[ses.user_id].tab_list;
						ada=false;
						for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;}}
						if(ada===false){
							ses.list[ses.user_id].tab_list.push(role);
							_tab_list=ses.list[ses.user_id].tab_list;
							_set_session(session_name,ses);
						}
						for(var i=0, iLen=_access_list.length; i<iLen;i++){
							var o=_access_list[i];
							if(o.acces_type=='ACCESSTYPE_ID'){
								var cmp=Ext.getCmp(o.access_code);
								if(cmp != undefined && cmp.enable != undefined){cmp.disable();}
							}
						}
						eval(r.d.init);
					}
				},
				failure : function(jqXHR, exception) {
					mainTab.setLoading(false);
					ajaxError(jqXHR, exception);
				}
			});
		}else{
			_lang[role.code]=ses.mod[role.code].language;
			mainTab.add(eval(ses.mod[role.code].coding));
			var	tab_list=menuSession=ses.list[ses.user_id].tab_list;
			ada=false;
			for(var i=0,iLen=tab_list.length;i<iLen; i++){if(tab_list[i].code==role.code){ada=true;}}
			if(ada===false){
				ses.list[ses.user_id].tab_list.push(role);
				_tab_list=ses.list[ses.user_id].tab_list;
				_set_session(session_name,ses);
			}
			for(var i=0, iLen=_access_list.length; i<iLen;i++){
				var o=_access_list[i];
				if(o.acces_type=='ACCESSTYPE_ID'){
					var cmp=Ext.getCmp(o.access_code);
					if(cmp != undefined && cmp.enable != undefined){cmp.disable();}
				}
			}
			eval(ses.mod[role.code].init);
		}
		
	},
	items : [
		{
			xtype:'panel',
			layout: 'border',
			flex:1,
			bodyBorder: false,
			border:false,
			items: [
				{
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
							bodyStyle:'margin-top: 1px;',
							scrollable : false,
							autoScroll : false,
							border:false,
							layout : 'fit',
							items : []
						}
					]
				},{
					xtype: 'panel',
					hidden:true,
					id : 'main.view',
					region: 'east',
					split: true,
					border:false,
					width: 400,
					html:'awdwd',
					tbar:[
						'->',{
							iconCls:'fa fa-close',
							tooltip:'Close View',
							handler:function(){
								Ext.getCmp('main.view').hide();
							}
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'main.confirm'}
    ],
	initComponent : function() {
		var $this = this;
		this.callParent(arguments);
		$this.addTab(_menu_code);
	}
});