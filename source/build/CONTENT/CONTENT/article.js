/*
	import cmp.ihtmleditor
	import cmp.ilistinput
	import cmp.idynamicoption
	import cmp.ipanel
	import cmp.iinput
	import cmp.itable
	import cmp.icombobox
	import cmp.idatefield
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('ARTICLE.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('ARTICLE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('ARTICLE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'ARTICLE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'ARTICLE.search',
			modal:false,
			title:'Artikel - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('ARTICLE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('ARTICLE.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search',
					id:'ARTICLE.search.btnSearch',
					handler: function() {
						Ext.getCmp('ARTICLE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'ARTICLE.search.btnReset',
					handler: function() {
						Ext.getCmp('ARTICLE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'ARTICLE.search.btnClose',
					handler: function() {
						Ext.getCmp('ARTICLE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'ARTICLE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Title',
							press:{
								enter:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},
							id:'ARTICLE.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Penulis',
							press:{
								enter:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},
							id:'ARTICLE.search.f2'
						},{
							xtype:'iinput',
							label : 'Tanggal',
							items : [
								{
									xtype:'idatefield',
									name : 'f3',
									margin:false,
									press:{
										enter:function(){
											_click('ARTICLE.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									name : 'f4',
									press:{
										enter:function(){
											_click('ARTICLE.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f5',
							press:{
								enter:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},
							fieldLabel: 'Aktif'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f6',
							press:{
								enter:function(){
									_click('ARTICLE.search.btnSearch');
								}
							},
							fieldLabel: 'Sistem'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'ARTICLE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('ARTICLE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('ARTICLE.dropdown').getValue()]=Ext.getCmp('ARTICLE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=ARTICLE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('ARTICLE_DELETE',function(){
						Ext.getCmp('ARTICLE.confirm').confirm({
							msg : "Apakah akan Menghapus Artikel '"+a.f1+"' ?",
							allow : 'ARTICLE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=ARTICLE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('ARTICLE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('ARTICLE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											// socket.send('USERMODULE','ARTICLE','DELETE');
											Ext.getCmp('ARTICLE.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('ARTICLE.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('ARTICLE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=ARTICLE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('ARTICLE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('ARTICLE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('ARTICLE.input.panel').qReset();
									Ext.getCmp('ARTICLE.input.i').setValue(a.i);
									Ext.getCmp('ARTICLE.input.f1').setValue(o.f1);
									Ext.getCmp('ARTICLE.input.f2').setValue(o.f2);
									Ext.getCmp('ARTICLE.input').closing = false;
									Ext.getCmp('ARTICLE.list').hide();
									Ext.getCmp('ARTICLE.input').show();
									Ext.getCmp('ARTICLE.input.f1').focus();
									Ext.getCmp('ARTICLE.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('ARTICLE.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
				},
				setting:function(a){
					_access('ARTICLE_SETTING',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=ARTICLE&f=initSetting',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('ARTICLE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('ARTICLE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('ARTICLE.setting.panel').qReset();
									Ext.getCmp('ARTICLE.setting.i').setValue(a.i);
									Ext.getCmp('ARTICLE.setting.f1').setValue(o.f1);
									Ext.getCmp('ARTICLE.setting.f2').setValue(o.f2);
									if(o.f3=='1'){
										Ext.getCmp('ARTICLE.setting.f3').setValue(true);
									}else{
										Ext.getCmp('ARTICLE.setting.f3').setValue(false);
									}
									if(o.f4=='1'){
										Ext.getCmp('ARTICLE.setting.f4').setValue(true);
									}else{
										Ext.getCmp('ARTICLE.setting.f4').setValue(false);
									}
									var list=r.d.l;
									Ext.getCmp('ARTICLE.setting.tableOption').resetTable();
									for(var i=0,iLen=list.length; i<iLen;i++){
										if(i !=0)
										Ext.getCmp('ARTICLE.setting.tableOption')._add();
										Ext.getCmp('ARTICLE.setting.tableOption')._get('id',i).setValue(list[i].d1);
										Ext.getCmp('ARTICLE.setting.tableOption')._get('tag_name',i).setValue(list[i].d2);
									}
									Ext.getCmp('ARTICLE.setting').closing = false;
									Ext.getCmp('ARTICLE.list').hide();
									Ext.getCmp('ARTICLE.setting').show();
									// Ext.getCmp('ARTICLE.setting.f1').focus();
									Ext.getCmp('ARTICLE.setting.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('ARTICLE.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('ARTICLE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('ARTICLE.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'ARTICLE.btnAdd',
					iconCls:'fa fa-plus',
					handler:function(a){
						Ext.getCmp('ARTICLE.input.panel').qReset();
						Ext.getCmp('ARTICLE.input').closing = false;
						Ext.getCmp('ARTICLE.list').hide();
						Ext.getCmp('ARTICLE.input').show();
						Ext.getCmp('ARTICLE.input.f1').focus();
						Ext.getCmp('ARTICLE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'ARTICLE.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'ARTICLE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'Title'},
								{id:'f2',text:'Penulis'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('ARTICLE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'ARTICLE.text',
							press:{
								enter:function(){
									_click('ARTICLE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'ARTICLE.btnSearch',
							handler : function(a) {
								Ext.getCmp('ARTICLE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'ARTICLE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('ARTICLE.search').show();
						Ext.getCmp('ARTICLE.search.f1').focus();
					}
				}
			],
			columns:[
				{ hidden: true, dataIndex: 'i' },
				{ text: 'Title',flex: 1, dataIndex: 'f1' },
				{ text: 'Penulis',width: 200,dataIndex: 'f2'},
				{ text: 'Tanggal',width: 120,dataIndex: 'f3' },
				{ xtype: 'active',dataIndex: 'f4'},
				{ xtype: 'active',text:'System'},{
					text: 'Setting',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-cog',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ARTICLE.list').fn.setting(record.data);
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ARTICLE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ARTICLE.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'ARTICLE.input',
			border:false,
			hidden:true,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('ARTICLE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ARTICLE.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'ARTICLE.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('ARTICLE.input.panel').qGetForm(true);
						if(req == false){
							var param = Ext.getCmp('ARTICLE.input.panel').qParams();
							Ext.Ajax.request({
								url : url + 'cmd?m=ARTICLE&f=save',
								method : 'POST',
								params:param,
								before:function(){
									Ext.getCmp('ARTICLE.input').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('ARTICLE.input').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('ARTICLE.list').refresh();
										Ext.getCmp('ARTICLE.input.i').setValue(r.d.id);
										Ext.getCmp('ARTICLE.input.f2').setValue(r.d.text);
										Ext.getCmp('ARTICLE.input.panel').qSetForm();
										socket.send('USERMODULE','ARTICLE','SAVE');
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('ARTICLE.input').setLoading(false);
									ajaxError(jqXHR, exception);
								}
							});
						}else{
							if(Ext.getCmp('ARTICLE.input.p').getValue()=='ADD'){
								Ext.create('App.cmp.Toast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				},{
					text: 'File',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-file',
					handler: function() {
						new Ext.create('App.cmp.Window',{
							title:'File Manager',
							layout:'fit',
							width: 300,
							height: 300,
							items:[
								new Ext.create('App.cmp.FileManager',{
									user:_employee_id
								})
							]
						}).show();
					}
				},'->',{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'ARTICLE.input.btnClose',
					iconCls:'fa fa-arrow-right',
					handler: function() {
						var req=Ext.getCmp('ARTICLE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('ARTICLE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'ARTICLE.close',
								onY : function() {
									Ext.getCmp('ARTICLE.input').hide();
									Ext.getCmp('ARTICLE.list').show();
								}
							});
						}else{
							Ext.getCmp('ARTICLE.input').hide();
							Ext.getCmp('ARTICLE.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'ARTICLE.input.panel',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					paddingBottom:false,
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'ARTICLE.input.i'
						},{
							xtype:'itextfield',
							maxLength:256,
							fieldLabel:'Title',
							name:'f1',
							id:'ARTICLE.input.f1',
							allowBlank: false
						},{
							xtype:'ihtmleditor',
							id:'ARTICLE.input.f2',
							name:'f2',
							flex:1,
						}
					]
				}
			]
		},{
			id:'ARTICLE.setting',
			title:'Artikel - Setting',
			border:false,
			hidden:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'setting',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('ARTICLE.setting.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ARTICLE.setting.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('setting');
				}
			},
			tbar: [
				{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'ARTICLE.setting.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('ARTICLE.setting.panel').qGetForm(true);
						if(req == false){
							Ext.getCmp('ARTICLE.confirm').confirm({
								msg : 'Apakah Akan Menyimpan Data Ini ?',
								allow : 'ARTICLE.save',
								onY : function() {
									var param = Ext.getCmp('ARTICLE.setting.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=ARTICLE&f=saveSetting',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('ARTICLE.setting').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('ARTICLE.setting').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('ARTICLE.setting').hide();
												Ext.getCmp('ARTICLE.list').show();
												Ext.getCmp('ARTICLE.list').refresh();
												Ext.getCmp('ARTICLE.setting.i').setValue(r.d);
												Ext.getCmp('ARTICLE.setting.panel').qSetForm();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('ARTICLE.setting').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
						}else{
							Ext.create('App.cmp.Toast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
						}
					}
				},'->',{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'ARTICLE.setting.btnClose',
					iconCls:'fa fa-arrow-right',
					handler: function() {
						var req=Ext.getCmp('ARTICLE.setting.panel').qGetForm();
						if(req == false){
							Ext.getCmp('ARTICLE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'ARTICLE.close',
								onY : function() {
									Ext.getCmp('ARTICLE.setting').hide();
									Ext.getCmp('ARTICLE.list').show();
								}
							});
						}else{
							Ext.getCmp('ARTICLE.setting').hide();
							Ext.getCmp('ARTICLE.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					paddingBottom:false,
					id : 'ARTICLE.setting.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'ARTICLE.setting.i'
						},{
							xtype:'itextfield',
							maxLength:256,
							fieldLabel:'Title',
							name:'f1',
							disabled:true,
							id:'ARTICLE.setting.f1',
						},{
							xtype:'iparameter',
							maxLength:64,
							parameter:'POST_TYPE',
							fieldLabel:'Jenis Artikel',
							name:'f2',
							id:'ARTICLE.setting.f2',
							allowBlank: false
						},{
							xtype:'icheckbox',
							maxLength:64,
							fieldLabel:'Aktif',
							name:'f3',
							disable:true,
							id:'ARTICLE.setting.f3',
						},{
							xtype:'icheckbox',
							maxLength:64,
							fieldLabel:'System',
							name:'f4',
							disable:true,
							id:'ARTICLE.setting.f4',
						},{
							xtype:'ilistinput',
							id:'ARTICLE.setting.tableOption',
							height:200,
							name:'options',
							items:[
								{
									xtype:'idynamicoption',
									name:'tag_name',
									type_dynamic:'DO_TAG',
									text:'Tag',
									allowBlank: false,
									flex:1,
									emptyText:'Tag Name'
								},{
									xtype:'ihiddenfield',
									name:'id',
									text:'',
								}
							]
						}
					]
				}
			],
		},{xtype:'iconfirm',id : 'ARTICLE.confirm'}
	]
});