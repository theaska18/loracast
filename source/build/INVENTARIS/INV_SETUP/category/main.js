/*
	import cmp.ipanel
	import cmp.iconfig
	import cmp.icomboquery
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				_click('CATEGORY.btnRefresh');
			}
		},{
			key:'f6',
			fn:function(){
				_click('CATEGORY.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'CATEGORY.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'treepanel',
			id : 'CATEGORY.list',
			border : false,
			rootVisible : false,
			paddingBottom:false,
			lines : true,
			flex:1,
			rowLines : true,
			root : {
				expanded : false
			},
			tbar : [iif(_mobile,'<b>Kategori</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'CATEGORY.config',
					menuCode:'CATEGORY',
					code:[
						iif(_access('CATEGORY_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('CATEGORY_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					iconCls: 'fa fa-plus fa-green',
					id:'CATEGORY.btnAdd',
					handler : function(a) {
						Ext.getCmp('CATEGORY.input.panel').qReset();
						Ext.getCmp('CATEGORY.input.pc').setValue(null);
						Ext.getCmp('CATEGORY.input.f1').setReadOnly(false);
						Ext.getCmp('CATEGORY.input.p').setValue('ADD');
						Ext.getCmp('CATEGORY.list').hide();
						Ext.getCmp('CATEGORY.input').show();
						if(getSetting('CATEGORY','SEQUENCE')=='Y'){
							Ext.getCmp('CATEGORY.input.f1').setReadOnly(true);
							Ext.getCmp('CATEGORY.input.f2').focus();
						}else{
							Ext.getCmp('CATEGORY.input.f1').setReadOnly(false);
							Ext.getCmp('CATEGORY.input.f1').focus();
						}
						Ext.getCmp('CATEGORY.input.panel').qSetForm();
					}
				},{
					text: 'Refresh',
					tooltip: 'Refresh <b>[F5]</b>',
					id:'CATEGORY.btnRefresh',
					iconCls: 'fa fa-refresh',
					handler : function(a) {
						Ext.Ajax.request({
							url : url + 'cmd?m=CATEGORY&f=getList',
							method : 'GET',
							before:function(){
								Ext.getCmp('main.tabCATEGORY').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('main.tabCATEGORY').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									Ext.getCmp('CATEGORY.list').store.setRootNode([]);
									var c = Ext.getCmp('CATEGORY.list').store.getRootNode();
									c.insertChild(1, r.d);
									Ext.getCmp('CATEGORY.list').expandAll()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('main.tabCATEGORY').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					}
				}
			],
			columns : [
				{
					xtype : 'treecolumn',
					text : 'Nama Kategori',
					flex : 1,
					dataIndex : 'text'
				},{
					text :'Tambah',
					width : 55,
					hideable:false,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-plus',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('CATEGORY_ADD',function(){
							Ext.getCmp('CATEGORY.input.panel').qReset();
							Ext.getCmp('CATEGORY.input.pc').setValue(record.raw.f1);
							Ext.getCmp('CATEGORY.input.f1').setReadOnly(false);
							Ext.getCmp('CATEGORY.input.p').setValue('ADD');
							Ext.getCmp('CATEGORY.list').hide();
							Ext.getCmp('CATEGORY.input').show();
							if(getSetting('CATEGORY','SEQUENCE')=='Y'){
								Ext.getCmp('CATEGORY.input.f1').setReadOnly(true);
								Ext.getCmp('CATEGORY.input.f2').focus();
							}else{
								Ext.getCmp('CATEGORY.input.f1').setReadOnly(false);
								Ext.getCmp('CATEGORY.input.f1').focus();
							}
							Ext.getCmp('CATEGORY.input.panel').qSetForm();
						});
					},
					isDisabled : function(view, rowIdx, colIdx, item, record) {
						return record.data.leaf;
					}
				}, {
					text : 'Edit',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					hideable:false,
					iconCls : 'fa fa-edit',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('CATEGORY_UPDATE',function(){
							Ext.Ajax.request({
								url : url + 'cmd?m=CATEGORY&f=initUpdate',
								method : 'GET',
								params:{i:record.raw.f1},
								before:function(){
									Ext.getCmp('main.tabCATEGORY').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('main.tabCATEGORY').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('CATEGORY.input.panel').qReset();
										var o=r.d.o;
										Ext.getCmp('CATEGORY.input.f1').setReadOnly(true);
										Ext.getCmp('CATEGORY.input.f1').setValue(o.f1);
										Ext.getCmp('CATEGORY.input.f2').setValue(o.f2);
										Ext.getCmp('CATEGORY.input.f4').setValue(o.f4);
										Ext.getCmp('CATEGORY.input.f5').setValue(o.f5);
										Ext.getCmp('CATEGORY.input.p').setValue('UPDATE');
										Ext.getCmp('CATEGORY.list').hide();
										Ext.getCmp('CATEGORY.input').show();
										Ext.getCmp('CATEGORY.input.panel').qSetForm();
										Ext.getCmp('CATEGORY.input.f2').focus();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('main.tabCATEGORY').setLoading(false);
									ajaxError(jqXHR, exception);
								}
							});
						});
					}
				}, {
					text : 'Hapus',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-trash',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('CATEGORY_DELETE',function(){
							if(record.raw.del===true){
								Ext.getCmp('CATEGORY.confirm').confirm({
									msg : "Apakah akan Hapus Kategori '"+record.raw.f1+"'",
									allow : 'CATEGORY.delete',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=CATEGORY&f=delete',
											method : 'POST',
											params : {
												i : record.raw.f1
											},
											before:function(){
												Ext.getCmp('main.tabCATEGORY').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('main.tabCATEGORY').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													Ext.Ajax.request({
														url : url + 'cmd?m=CATEGORY&f=getList',
														method : 'GET',
														before:function(){
															Ext.getCmp('main.tabCATEGORY').setLoading(true);
														},
														success : function(response) {
															Ext.getCmp('main.tabCATEGORY').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S') {
																Ext.getCmp('CATEGORY.list').store.setRootNode([]);
																var c = Ext.getCmp('CATEGORY.list').store.getRootNode();
																c.insertChild(1, r.d);
																Ext.getCmp('CATEGORY.list').expandAll()
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('main.tabCATEGORY').setLoading(false);
															ajaxError(jqXHR, exception);
														}
													});
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('main.tabCATEGORY').setLoading(false);
												ajaxError(jqXHR, exception);
											}
										});
									}
								});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak Dapat dihapus.',type : 'warning'});
							}
						});
					}
				}
			]
		},{
			id 		: 'CATEGORY.input',
			hidden 	: true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('CATEGORY.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('CATEGORY.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar 	: [
				{
					text : 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'CATEGORY.input.btnClose',
					iconCls : 'fa fa-chevron-left fa-red',
					handler : function() {
						var req=Ext.getCmp('CATEGORY.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('CATEGORY.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'CATEGORY.close',
								onY : function() {
									Ext.getCmp('CATEGORY.input').hide();
									Ext.getCmp('CATEGORY.list').show();
								}
							});
						}else{
							Ext.getCmp('CATEGORY.input').hide();
							Ext.getCmp('CATEGORY.list').show();
						}
					}
				},'->','<b>Input Kategori</b>','->',{
					xType 	: 'button',
					text 	: 'Simpan',
					tooltip	:'Simpan <b>[Ctrl+s]</b>',
					id:'CATEGORY.input.btnSave',
					iconCls : 'fa fa-save fa-green',
					handler : function() {
						var req=Ext.getCmp('CATEGORY.input.panel').qGetForm(true);
						if (req== false) 
							Ext.getCmp('CATEGORY.confirm').confirm({
								msg :'Apakah akan Menyimpan data ini?',
								allow : 'CATEGORY.save',
								onY : function() {
									var param = Ext.getCmp('CATEGORY.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=CATEGORY&f=save',
										method : 'POST',
										params : param,
										before:function(){
											Ext.getCmp('CATEGORY.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('CATEGORY.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('CATEGORY.input').hide();
												Ext.getCmp('CATEGORY.list').show();
												Ext.Ajax.request({
													url : url + 'cmd?m=CATEGORY&f=getList',
													method : 'GET',
													before:function(){
														Ext.getCmp('main.tabCATEGORY').setLoading(true);
													},
													success : function(response) {
														Ext.getCmp('main.tabCATEGORY').setLoading(false);
														var r = ajaxSuccess(response);
														if (r.r == 'S') {
															Ext.getCmp('CATEGORY.list').store.setRootNode([]);
															var c = Ext.getCmp('CATEGORY.list').store.getRootNode();
															c.insertChild(1, r.d);
															Ext.getCmp('CATEGORY.list').expandAll()
														}
													},
													failure : function(jqXHR, exception) {
														Ext.getCmp('main.tabCATEGORY').setLoading(false);
														ajaxError(jqXHR, exception);
													}
												});
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('CATEGORY.input').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('CATEGORY.input').hide();
							Ext.getCmp('CATEGORY.list').show();
						}
					}
				}
			],
			items : [
				{
					xtype:'ipanel',
					submit:'CATEGORY.input.btnSave',
					id : 'CATEGORY.input.panel',
					width:350,
					items : [
						{
							xtype:'ihiddenfield',
							id : 'CATEGORY.input.pc',
							name : 'pc'
						},{
							xtype:'ihiddenfield',
							id : 'CATEGORY.input.p',
							name : 'p'
						},{
							xtype:'itextfield',
							submit:'CATEGORY.input.panel',
							id : 'CATEGORY.input.f1',
							property:{
								upper:true,
								space:false
							},
							name : 'f1',
							maxLength:32,
							fieldLabel:'Kode Kategori',
							allowBlank : false
						},{
							xtype:'itextfield',
							submit:'CATEGORY.input.panel',
							id : 'CATEGORY.input.f2',
							property:{
								dynamic:true
							},
							fieldLabel: 'Nama Kategori',
							name : 'f2',
							allowBlank : false
						},{
							xtype:'icomboquery',
							submit:'CATEGORY.input.panel',
							id : 'CATEGORY.input.f5',
							query:"SELECT category_group_id AS id,CONCAT(category_group_code,' - ',category_group_name) AS text FROM inv_category_group WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY category_group_code ASC",
							name : 'f5',
							fieldLabel: 'Grup Kategori',
							allowBlank : false
						},{
							xtype:'icheckbox',
							submit:'CATEGORY.input.panel',
							id : 'CATEGORY.input.f4',
							name : 'f4',
							fieldLabel:'Aktif',
							checked:true,
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('CATEGORY.input.panel').qGetForm() == false)
					Ext.getCmp('CATEGORY.confirm').confirm({
						msg : 'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'CATEGORY.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'CATEGORY.confirm'}
	],
});