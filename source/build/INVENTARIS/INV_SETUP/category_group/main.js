/*
	import cmp.ipanel
	import cmp.icombobox
	import cmp.itextarea
	import cmp.itable
	import cmp.iconfig
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('CATEGORY_GROUP.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('CATEGORY_GROUP.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('CATEGORY_GROUP.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('CATEGORY_GROUP.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'CATEGORY_GROUP.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'CATEGORY_GROUP.search',
			modal:false,
			title:'Grup Kategori - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('CATEGORY_GROUP.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('CATEGORY_GROUP.search.f1').focus();
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
					id:'CATEGORY_GROUP.search.btnSearch',
					handler: function() {
						Ext.getCmp('CATEGORY_GROUP.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'CATEGORY_GROUP.search.btnReset',
					handler: function() {
						Ext.getCmp('CATEGORY_GROUP.search.panel').qReset();
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('CATEGORY_GROUP.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'CATEGORY_GROUP.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Grup',
							press:{
								enter:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								}
							},
							id:'CATEGORY_GROUP.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Grup',
							press:{
								enter:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								}
							},
							id:'CATEGORY_GROUP.search.f3'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							press:{
								enter:function(){
									_click('CATEGORY_GROUP.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel: 'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'CATEGORY_GROUP.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('CATEGORY_GROUP.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('CATEGORY_GROUP.dropdown').getValue()]=Ext.getCmp('CATEGORY_GROUP.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=CATEGORY_GROUP&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('CATEGORY_GROUP_DELETE',function(){
						Ext.getCmp('CATEGORY_GROUP.confirm').confirm({
							msg : "Apakah akan hapus Grup '"+a.f1+"'?",
							allow : 'CATEGORY_GROUP.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=CATEGORY_GROUP&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('CATEGORY_GROUP.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('CATEGORY_GROUP.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('CATEGORY_GROUP.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('CATEGORY_GROUP.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('CATEGORY_GROUP_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=CATEGORY_GROUP&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('CATEGORY_GROUP.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('CATEGORY_GROUP.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('CATEGORY_GROUP.input.panel').qReset();
									Ext.getCmp('CATEGORY_GROUP.input.f1').setReadOnly(true);
									Ext.getCmp('CATEGORY_GROUP.input.f1').setValue(a.f1);
									Ext.getCmp('CATEGORY_GROUP.input.f2').setValue(a.f2);
									Ext.getCmp('CATEGORY_GROUP.input.f3').setValue(o.f3);
									Ext.getCmp('CATEGORY_GROUP.input.f4').setValue(o.f4);
									Ext.getCmp('CATEGORY_GROUP.input.i').setValue(a.i);
									Ext.getCmp('CATEGORY_GROUP.input.p').setValue('UPDATE');
									Ext.getCmp('CATEGORY_GROUP.list').hide();
									Ext.getCmp('CATEGORY_GROUP.input').show();
									Ext.getCmp('CATEGORY_GROUP.input.f2').focus();
									Ext.getCmp('CATEGORY_GROUP.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('CATEGORY_GROUP.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('CATEGORY_GROUP.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('CATEGORY_GROUP.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Grup Kategori</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'CATEGORY_GROUP.config',
				menuCode:'CATEGORY_GROUP',
				code:[
					iif(_access('CATEGORY_GROUP_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('CATEGORY_GROUP_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
				]
			},'->',{
					text:'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'CATEGORY_GROUP.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('CATEGORY_GROUP.input.panel').qReset();
						Ext.getCmp('CATEGORY_GROUP.input.f1').setReadOnly(false);
						Ext.getCmp('CATEGORY_GROUP.input.p').setValue('ADD');
						Ext.getCmp('CATEGORY_GROUP.list').hide();
						Ext.getCmp('CATEGORY_GROUP.input').show();
						if(getSetting('CATEGORY_GROUP','SEQUENCE')=='Y'){
							Ext.getCmp('CATEGORY_GROUP.input.f1').setReadOnly(true);
							Ext.getCmp('CATEGORY_GROUP.input.f2').focus();
						}else{
							Ext.getCmp('CATEGORY_GROUP.input.f1').setReadOnly(false);
							Ext.getCmp('CATEGORY_GROUP.input.f1').focus();
						}
						Ext.getCmp('CATEGORY_GROUP.input.panel').qSetForm();
					}
				}, {
					xtype:'buttongroup',
					hidden:_mobile,
					id:'CATEGORY_GROUP.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'CATEGORY_GROUP.dropdown',
							emptyText:'Pencarian',
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
									_click('CATEGORY_GROUP.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'CATEGORY_GROUP.text',
							press:{
								enter:function(){
									_click('CATEGORY_GROUP.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'CATEGORY_GROUP.btnSearch',
							handler : function(a) {
								Ext.getCmp('CATEGORY_GROUP.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'CATEGORY_GROUP.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('CATEGORY_GROUP.search').show();
						Ext.getCmp('CATEGORY_GROUP.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'Kode Grup',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Grup',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',flex: true,dataIndex: 'f3' },
				{ xtype:'active',dataIndex: 'f4'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('CATEGORY_GROUP.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('CATEGORY_GROUP.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'CATEGORY_GROUP.input',
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
									_click('CATEGORY_GROUP.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('CATEGORY_GROUP.input.btnClose');
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
					id:'CATEGORY_GROUP.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('CATEGORY_GROUP.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('CATEGORY_GROUP.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'CATEGORY_GROUP.close',
								onY : function() {
									Ext.getCmp('CATEGORY_GROUP.input').hide();
									Ext.getCmp('CATEGORY_GROUP.list').show();
								}
							});
						}else{
							Ext.getCmp('CATEGORY_GROUP.input').hide();
							Ext.getCmp('CATEGORY_GROUP.list').show();
						}
					}
				},'->','<b>Input Group Kategori</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'CATEGORY_GROUP.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('CATEGORY_GROUP.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('CATEGORY_GROUP.confirm').confirm({
								msg : 'Apakah akan simpan data ini?',
								allow : 'CATEGORY_GROUP.save',
								onY : function() {
									var param = Ext.getCmp('CATEGORY_GROUP.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=CATEGORY_GROUP&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('CATEGORY_GROUP.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('CATEGORY_GROUP.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('CATEGORY_GROUP.input').hide();
												Ext.getCmp('CATEGORY_GROUP.list').show();
												Ext.getCmp('CATEGORY_GROUP.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('CATEGORY_GROUP.input').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('CATEGORY_GROUP.input').hide();
							Ext.getCmp('CATEGORY_GROUP.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					submit:'CATEGORY_GROUP.input.btnSave',
					id : 'CATEGORY_GROUP.input.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'CATEGORY_GROUP.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'CATEGORY_GROUP.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'CATEGORY_GROUP.input.panel',
							fieldLabel:'Kode Grup',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'CATEGORY_GROUP.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							submit:'CATEGORY_GROUP.input.panel',
							name:'f2',
							fieldLabel:'Nama Grup',
							property:{
								dynamic:true
							},
							id:'CATEGORY_GROUP.input.f2',
							result:'dynamic',
							allowBlank: false
						},{
							xtype:'itextarea',
							submit:'CATEGORY_GROUP.input.panel',
							name:'f3',
							maxLength:128,
							fieldLabel:'Deskripsi',
							id:'CATEGORY_GROUP.input.f3'
						},{
							xtype:'icheckbox',
							submit:'CATEGORY_GROUP.input.panel',
							name:'f4',
							fieldLabel:'Aktif',
							id:'CATEGORY_GROUP.input.f4',
							checked:true
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('CATEGORY_GROUP.input.panel').qGetForm() == false)
					Ext.getCmp('CATEGORY_GROUP.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'CATEGORY_GROUP.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'CATEGORY_GROUP.confirm'}
	]
});