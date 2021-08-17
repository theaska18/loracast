/*
	import cmp.icombobox
	import cmp.ipanel
	import cmp.itable
	import cmp.itextarea
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('SYSTEM_PROPERTY.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('SYSTEM_PROPERTY.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('SYSTEM_PROPERTY.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('SYSTEM_PROPERTY.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'SYSTEM_PROPERTY.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'SYSTEM_PROPERTY.search',
			modal:false,
			title:'Properti Sistem - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('SYSTEM_PROPERTY.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('SYSTEM_PROPERTY.search.f1').focus();
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
					id:'SYSTEM_PROPERTY.search.btnSearch',
					handler: function() {
						Ext.getCmp('SYSTEM_PROPERTY.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'SYSTEM_PROPERTY.search.btnReset',
					handler: function() {
						Ext.getCmp('SYSTEM_PROPERTY.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'SYSTEM_PROPERTY.search.btnClose',
					handler: function() {
						Ext.getCmp('SYSTEM_PROPERTY.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'SYSTEM_PROPERTY.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Properti',
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},
							id:'SYSTEM_PROPERTY.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Properti',
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},
							id:'SYSTEM_PROPERTY.search.f2'
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Nilai',
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},
							id:'SYSTEM_PROPERTY.search.f3'
						},{
							xtype:'itextfield',
							name:'f4',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.search.btnSearch');
								}
							},
							id:'SYSTEM_PROPERTY.search.f4'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'SYSTEM_PROPERTY.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('SYSTEM_PROPERTY.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('SYSTEM_PROPERTY.dropdown').getValue()]=Ext.getCmp('SYSTEM_PROPERTY.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=SYSTEM_PROPERTY&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('SYSTEM_PROPERTY_DELETE',function(){
						Ext.getCmp('SYSTEM_PROPERTY.confirm').confirm({
							msg : "Apakah akan Menghapus kode Peroperti '"+a.f1+"' ?",
							allow : 'SYSTEM_PROPERTY.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=SYSTEM_PROPERTY&f=delete',
									method : 'POST',
									params : {
										i : a.f1
									},
									before:function(){
										Ext.getCmp('SYSTEM_PROPERTY.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('SYSTEM_PROPERTY.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											// socket.send('USERMODULE','SYSTEM_PROPERTY','DELETE');
										}
										Ext.getCmp('SYSTEM_PROPERTY.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('SYSTEM_PROPERTY.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					// Ext.getCmp('SYSTEM_PROPERTY.input').setTitle('Sistem Properti - Edit');
					_access('SYSTEM_PROPERTY_UPDATE',function(){
						Ext.getCmp('SYSTEM_PROPERTY.input').closing = false;
						Ext.getCmp('SYSTEM_PROPERTY.list').hide();
						Ext.getCmp('SYSTEM_PROPERTY.input.p').setValue('UPDATE');
						Ext.getCmp('SYSTEM_PROPERTY.input').show();
						Ext.getCmp('SYSTEM_PROPERTY.input.f1').setValue(a.f1);
						Ext.getCmp('SYSTEM_PROPERTY.input.panel')._load();
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('SYSTEM_PROPERTY.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('SYSTEM_PROPERTY.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Properti Sistem</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'SYSTEM_PROPERTY.btnAdd',
					iconCls:'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('SYSTEM_PROPERTY.input.panel').qReset();
						Ext.getCmp('SYSTEM_PROPERTY.input.f1').setReadOnly(false);
						Ext.getCmp('SYSTEM_PROPERTY.input.p').setValue('ADD');
						Ext.getCmp('SYSTEM_PROPERTY.input').closing = false;
						// Ext.getCmp('SYSTEM_PROPERTY.input').setTitle('Sistem Properti - Tambah');
						Ext.getCmp('SYSTEM_PROPERTY.list').hide();
						Ext.getCmp('SYSTEM_PROPERTY.input').show();
						Ext.getCmp('SYSTEM_PROPERTY.input.f1').focus();
						Ext.getCmp('SYSTEM_PROPERTY.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					hidden:_mobile,
					id:'SYSTEM_PROPERTY.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'SYSTEM_PROPERTY.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Property'},
								{id:'f1',text:'Kode Property'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'SYSTEM_PROPERTY.text',
							press:{
								enter:function(){
									_click('SYSTEM_PROPERTY.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'SYSTEM_PROPERTY.btnSearch',
							handler : function(a) {
								Ext.getCmp('SYSTEM_PROPERTY.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'SYSTEM_PROPERTY.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('SYSTEM_PROPERTY.search').show();
						Ext.getCmp('SYSTEM_PROPERTY.search.f1').focus();
					}
				}
			],
			columns:[
				{xtype:'rownumberer'},
				{ text: 'Kode Properti',width: 150, dataIndex: 'f1' },
				{ text: 'Nama Properti',width: 250,dataIndex: 'f2'},
				{ text: 'Nilai',width: 150,dataIndex: 'f3' },
				{ text: 'Keterangan',flex:1,minWidth: 200,dataIndex: 'f4' },
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('SYSTEM_PROPERTY.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('SYSTEM_PROPERTY.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'SYSTEM_PROPERTY.input',
			// title:'Properti Sistem',
			hidden:true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('SYSTEM_PROPERTY.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('SYSTEM_PROPERTY.input.btnClose');
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
					id:'SYSTEM_PROPERTY.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('SYSTEM_PROPERTY.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('SYSTEM_PROPERTY.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'SYSTEM_PROPERTY.close',
								onY : function() {
									Ext.getCmp('SYSTEM_PROPERTY.input').hide();
									Ext.getCmp('SYSTEM_PROPERTY.list').show();
								}
							});
						}else{
							Ext.getCmp('SYSTEM_PROPERTY.input').hide();
							Ext.getCmp('SYSTEM_PROPERTY.list').show();
						}
					}
				},'->','<b>Input Property</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'SYSTEM_PROPERTY.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('SYSTEM_PROPERTY.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('SYSTEM_PROPERTY.input.panel')._save(function(){
								Ext.getCmp('SYSTEM_PROPERTY.input').hide();
								Ext.getCmp('SYSTEM_PROPERTY.list').show();
								Ext.getCmp('SYSTEM_PROPERTY.list').refresh();
							});
						else{
							if(Ext.getCmp('SYSTEM_PROPERTY.input.p').getValue()=='ADD'){
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
					id : 'SYSTEM_PROPERTY.input.panel',
					submit:'SYSTEM_PROPERTY.input.btnSave',
					width: 350,
					database:{
						command:{
							app_system_property:{
								primary:'system_property_code'
							}
						}
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'SYSTEM_PROPERTY.input.p'
						},{
							xtype:'itextfield',
							maxLength:16,
							fieldLabel:'Kode Properti',
							submit:'SYSTEM_PROPERTY.input.panel',
							database:{
								table:'app_system_property',
								field:'system_property_code'
							},
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'SYSTEM_PROPERTY.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Properti',
							submit:'SYSTEM_PROPERTY.input.panel',
							database:{
								table:'app_system_property',
								field:'system_property_name'
							},
							property:{
								dynamic:true
							},
							id:'SYSTEM_PROPERTY.input.f2',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Nilai',
							submit:'SYSTEM_PROPERTY.input.panel',
							database:{
								table:'app_system_property',
								field:'system_property_value'
							},
							id:'SYSTEM_PROPERTY.input.f3'
						},{
							xtype:'itextarea',
							name:'f4',
							fieldLabel:'Deskripsi',
							submit:'SYSTEM_PROPERTY.input.panel',
							database:{
								table:'app_system_property',
								field:'description'
							},
							id:'SYSTEM_PROPERTY.input.f4'
						}
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'SYSTEM_PROPERTY.confirm'}
	]
});