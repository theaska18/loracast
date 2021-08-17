/*
	import cmp.itable
	import cmp.icombobox
	import cmp.ipanel
	import cmp.itextarea
	import PARAMETER.iparameter
*/
new Ext.Panel({
	id : 'MENU_GROUP.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'MENU_GROUP.search',
			modal:false,
			title:'Menu Grup - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('MENU_GROUP.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('MENU_GROUP.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('MENU_GROUP.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('MENU_GROUP.search.f1').focus();
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
					iconCls:'fa fa-search fa-green',
					id:'MENU_GROUP.search.btnSearch',
					handler: function() {
						Ext.getCmp('MENU_GROUP.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'MENU_GROUP.search.btnReset',
					handler: function() {
						Ext.getCmp('MENU_GROUP.search.panel').qReset();
					}
				},{
					text:'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('MENU_GROUP.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'MENU_GROUP.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Grup',
							press:{
								enter:function(){
									_click('MENU_GROUP.search.btnSearch');
								}
							},
							id:'MENU_GROUP.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Grup',
							press:{
								enter:function(){
									_click('MENU_GROUP.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							id:'MENU_GROUP.search.f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('MENU_GROUP.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('MENU_GROUP.search.btnSearch');
								},
							},
							fieldLabel:'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'MENU_GROUP.list',
			autoRefresh:false,
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('MENU_GROUP.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('MENU_GROUP.dropdown').getValue()]=Ext.getCmp('MENU_GROUP.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=MENU_GROUP&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('MENU_GROUP_DELETE',function(){
						Ext.getCmp('MENU_GROUP.confirm').confirm({
							msg :'Are you sure delete Group Code '+a.f1,
							allow : 'MENU_GROUP.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=MENU_GROUP&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('MENU_GROUP.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('MENU_GROUP.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('MENU_GROUP.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('MENU_GROUP.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('MENU_GROUP_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=MENU_GROUP&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('MENU_GROUP.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('MENU_GROUP.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('MENU_GROUP.input.panel').qReset();
									Ext.getCmp('MENU_GROUP.input.f1').setReadOnly(true);
									Ext.getCmp('MENU_GROUP.input.f1').setValue(a.f1);
									Ext.getCmp('MENU_GROUP.input.f2').setValue(a.f2);
									Ext.getCmp('MENU_GROUP.input.f3').setValue(o.f3);
									Ext.getCmp('MENU_GROUP.input.f4').setValue(o.f4);
									Ext.getCmp('MENU_GROUP.input.i').setValue(a.i);
									Ext.getCmp('MENU_GROUP.input.p').setValue('UPDATE');
									Ext.getCmp('MENU_GROUP.input').closing = false;
									// Ext.getCmp('MENU_GROUP.input').setTitle('Menu Grup - Edit');
									Ext.getCmp('MENU_GROUP.list').hide();
									Ext.getCmp('MENU_GROUP.input').show();
									Ext.getCmp('MENU_GROUP.input.f2').focus();
									Ext.getCmp('MENU_GROUP.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('MENU_GROUP.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('MENU_GROUP.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('MENU_GROUP.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Menu Grup</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'MENU_GROUP.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('MENU_GROUP.input.panel').qReset();
						Ext.getCmp('MENU_GROUP.input.f1').setReadOnly(false);
						Ext.getCmp('MENU_GROUP.input.p').setValue('ADD');
						Ext.getCmp('MENU_GROUP.input').closing = false;
						Ext.getCmp('MENU_GROUP.list').hide();
						Ext.getCmp('MENU_GROUP.input').show();
						// Ext.getCmp('MENU_GROUP.input').setTitle('Menu Grup - Tambah');
						Ext.getCmp('MENU_GROUP.input.f1').focus();
						Ext.getCmp('MENU_GROUP.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					hidden:_mobile,
					id:'MENU_GROUP.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'MENU_GROUP.dropdown',
							emptyText:'Searching',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Grup'},
								{id:'f1',text:'Kode Grup'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('MENU_GROUP.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'MENU_GROUP.text',
							press:{
								enter:function(){
									_click('MENU_GROUP.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'MENU_GROUP.btnSearch',
							handler : function(a) {
								Ext.getCmp('MENU_GROUP.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'MENU_GROUP.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('MENU_GROUP.search').show();
						Ext.getCmp('MENU_GROUP.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ text: 'Kode Grup',width: 150, dataIndex: 'f1' },
				{ text: 'Nama Grup',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',flex: true,minWidth:200,dataIndex: 'f3' },
				{ xtype:'active',dataIndex: 'f4'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls:'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('MENU_GROUP.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls:'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('MENU_GROUP.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'MENU_GROUP.input',
			// title:'Menu Grup',
			border:false,
			hidden:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('MENU_GROUP.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('MENU_GROUP.input.btnClose');
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
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'MENU_GROUP.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('MENU_GROUP.input.panel').qGetForm();
							if(req == false){
								Ext.getCmp('MENU_GROUP.confirm').confirm({
									msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
									allow : 'MENU_GROUP.close',
									onY : function() {
										Ext.getCmp('MENU_GROUP.input').hide();
										Ext.getCmp('MENU_GROUP.list').show();
									}
								});
							}else{
								Ext.getCmp('MENU_GROUP.input').hide();
								Ext.getCmp('MENU_GROUP.list').show();
							}
					}
				},'->','<b>Input Grup</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'MENU_GROUP.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('MENU_GROUP.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('MENU_GROUP.confirm').confirm({
								msg : 'Apakah akan simpan data ini?',
								allow : 'MENU_GROUP.save',
								onY : function() {
									var param = Ext.getCmp('MENU_GROUP.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=MENU_GROUP&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('MENU_GROUP.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('MENU_GROUP.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('MENU_GROUP.input').hide();
												Ext.getCmp('MENU_GROUP.list').show();
												Ext.getCmp('MENU_GROUP.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('MENU_GROUP.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('MENU_GROUP.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'MENU_GROUP.input.panel',
					submit:'MENU_GROUP.input.btnSave',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'MENU_GROUP.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'MENU_GROUP.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'MENU_GROUP.input.panel',
							fieldLabel:'Kode Grup',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'MENU_GROUP.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							maxLength:64,
							submit:'MENU_GROUP.input.panel',
							fieldLabel:'Nama Grup',
							property:{dynamic:true},
							id:'MENU_GROUP.input.f2',
							result:'dynamic',
							allowBlank: false
						},{
							xtype:'itextarea',
							submit:'MENU_GROUP.input.panel',
							name:'f3',
							fieldLabel:'Deskripsi',
							id:'MENU_GROUP.input.f3',
							maxLength:128,
						},{
							xtype:'icheckbox',
							name:'f4',
							submit:'MENU_GROUP.input.panel',
							fieldLabel:'Aktif',
							id:'MENU_GROUP.input.f4',
							checked:true
						}
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'MENU_GROUP.confirm'}
	]
});