/*
	import cmp.iinput
	import cmp.inumberfield
	import cmp.icombobox
	import cmp.ipanel
	import cmp.itablegrid
	import cmp.itextarea
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('PAY_TYPE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('PAY_TYPE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('PAY_TYPE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('PAY_TYPE.btnAdd');
			}
		}
	]
});
Ext.Panel({
	id : 'PAY_TYPE.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'PAY_TYPE.search',
			modal:false,
			title:'Jenis Pembayaran - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('PAY_TYPE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('PAY_TYPE.search.f6').focus();
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
					id:'PAY_TYPE.search.btnSearch',
					handler: function() {
						Ext.getCmp('PAY_TYPE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'PAY_TYPE.search.btnReset',
					handler: function() {
						Ext.getCmp('PAY_TYPE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('PAY_TYPE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PAY_TYPE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							fieldLabel:'Kode Jenis',
							name:'f6',
							id:'PAY_TYPE.search.f6',
							database:{
								table:'payment_type',
								field:'payment_type_code',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							fieldLabel:'Nama Jenis',
							name:'f1',
							database:{
								table:'payment_type',
								field:'payment_type_name',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							fieldLabel:'Keterangan',
							name:'f2',
							database:{
								table:'payment_type',
								field:'description',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							fieldLabel:'Kredit',
							parameter:'ACTIVE_FLAG',
							width:200,
							database:{
								table:'payment_type',
								field:'kredit',
								type:'active'
							},
							name : 'f3',
							press:{
								enter:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							fieldLabel:'Aktif',
							parameter:'ACTIVE_FLAG',
							width:200,
							database:{
								table:'payment_type',
								field:'active_flag',
								type:'active'
							},
							name : 'f5',
							press:{
								enter:function(){
									_click('PAY_TYPE.search.btnSearch');
								}
							}
						},{
							xtype:'ihiddenfield',
							value:_tenant_id,
							database:{
								table:'payment_type',
								field:'tenant_id',
								type:'double'
							},
							name : 'f7',
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'PAY_TYPE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('PAY_TYPE.search.panel')._parameter();
				}else{
					var obj={};
					obj['payment_type']={};
					obj['payment_type'][Ext.getCmp('PAY_TYPE.dropdown').getValue()]={
						value:Ext.getCmp('PAY_TYPE.text').getValue(),
						separator:'like'
					};
					obj['payment_type']['active_flag']={
						value:true,
						type:'boolean',
						separator:'='
					}
					obj['payment_type']['M.tenant_id']={
						value:_tenant_id,
						type:'double',
						separator:'='
					}
					return JSON.stringify(obj);
				}
			},
			fn:{
				delete:function(a){
					_access('PAY_TYPE_delete',function(){
						Ext.getCmp('PAY_TYPE.confirm').confirm({
							msg : "Apakah Akan Menghapus Kode Jenis '"+a.kd_payment_type+"' ?",
							allow : 'PAY_TYPE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : _url('PAY_TYPE','delete'),
									method : 'POST',
									params : {
										i : a.payment_type_id
									},
									before:function(){
										Ext.getCmp('PAY_TYPE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('PAY_TYPE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('PAY_TYPE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('PAY_TYPE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('PAY_TYPE_update',function(){
						Ext.getCmp('PAY_TYPE.list').hide();
						Ext.getCmp('PAY_TYPE.input').show();
						Ext.getCmp('PAY_TYPE.input.i').setValue(a.payment_type_id);
						Ext.getCmp('PAY_TYPE.input.panel')._load();
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('PAY_TYPE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('PAY_TYPE.list').fn.update(a.dataRow);
				}
			},
			database:{
				table:'payment_type'
			},
			tbar:[iif(_mobile,'<b>Jenis Pembayaran</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Add <b>[F6]</b>',
					id:'PAY_TYPE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('PAY_TYPE.input.panel').qReset();
						Ext.getCmp('PAY_TYPE.list').hide();
						Ext.getCmp('PAY_TYPE.input').show();
						Ext.getCmp('PAY_TYPE.input.f1').setReadOnly(false);
						Ext.getCmp('PAY_TYPE.input.f1').focus();
						Ext.getCmp('PAY_TYPE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'PAY_TYPE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'PAY_TYPE.dropdown',
							emptyText:'Pencarian',
							value:'payment_type_name',
							margin:false,
							data:[
								{id:'payment_type_name',text:'Nama Jenis'},
								{id:'payment_type_code',text:'Kode Jenis'},
								{id:'description',text:'Keterangan'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('PAY_TYPE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							margin:false,
							emptyText:'Pencarian',
							id:'PAY_TYPE.text',
							press:{
								enter:function(){
									_click('PAY_TYPE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Searching [F5]',
							id:'PAY_TYPE.btnSearch',
							handler : function(a) {
								Ext.getCmp('PAY_TYPE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Searching <b>[Ctrl+Shift+f]</b>',
					id:'PAY_TYPE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('PAY_TYPE.search').show();
						Ext.getCmp('PAY_TYPE.search.f6').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'payment_type_id',database:{field:'payment_type_id'} },
				{ text: 'Kode Jenis',width: 80, align:'center',dataIndex: 'payment_type_code',database:{field:'payment_type_code'}  },
				{ text: 'Nama Jenis',width:200, dataIndex: 'payment_type_name',database:{field:'payment_type_name'}  },
				{ text: 'Keterangan',flex: 1, dataIndex: 'description',database:{field:'description'}  },
				{ xtype:'active',text: 'Kredit',dataIndex: 'kredit',database:{field:'kredit'} },
				{ xtype:'active',text: 'Aktif',dataIndex: 'active_flag',database:{field:'active_flag'}},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PAY_TYPE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PAY_TYPE.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'PAY_TYPE.input',
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
									_click('PAY_TYPE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PAY_TYPE.input.btnClose');
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
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'PAY_TYPE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						Ext.getCmp('PAY_TYPE.input').hide();
						Ext.getCmp('PAY_TYPE.list').show();
					}
				},'->','<b>Input Jenis Bayar</b>','->',{
					text: 'Simpan',
					id:'PAY_TYPE.input.btnSave',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('PAY_TYPE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PAY_TYPE.input.panel')._save(function(){
								Ext.getCmp('PAY_TYPE.input').hide();
								Ext.getCmp('PAY_TYPE.list').show();
							});
						else if(req==true){
							Ext.getCmp('PAY_TYPE.input').hide();
							Ext.getCmp('PAY_TYPE.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					width: 350,
					submit:'PAY_TYPE.input.btnSave',
					id : 'PAY_TYPE.input.panel',
					database:{
						command:{
							payment_type:{
								primary:'payment_type_id',
								unique:[
									{
										field:'tenant_id',
										type:'double'
									},{field:'payment_type_code',name:'Kode Jenis'}
								]
							}
						}
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'PAY_TYPE.input.i',
							database:{
								table:'payment_type',
								field:'payment_type_id',
								type:'double'
							}
						},{
							xtype:'ihiddenfield',
							name:'t',
							value:_tenant_id,
							id:'PAY_TYPE.input.t',
							database:{
								table:'payment_type',
								field:'tenant_id',
								type:'double'
							}
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'TENANT.input.panel',
							fieldLabel:'Kode Jenis',
							name:'f1',
							database:{
								table:'payment_type',
								field:'payment_type_code'
							},
							id:'PAY_TYPE.input.f1',
							allowBlank: false,
							property:{
								upper:true,
								space:false
							}
						},{
							fieldLabel:'Nama Jenis',
							xtype:'itextfield',
							name:'f2',
							submit:'TENANT.input.panel',
							emptyText:'Nama Unit',
							database:{
								table:'payment_type',
								field:'payment_type_name'
							},
							id:'PAY_TYPE.input.f2',
							allowBlank: false,
							property:{
								dynamic:true
							}
						},{
							fieldLabel:'Keterangan',
							xtype:'itextarea',
							name:'f3',
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'description'
							},
							id:'PAY_TYPE.input.f3'
						},{
							fieldLabel:'Kredit',
							xtype:'icheckbox',
							name:'f6',
							checked:true,
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'kredit'
							},
							id:'PAY_TYPE.input.f6'
						},{
							fieldLabel:'Aktif',
							xtype:'icheckbox',
							name:'f5',
							checked:true,
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'active_flag'
							},
							id:'PAY_TYPE.input.f5'
						},{
							fieldLabel:'Buy',
							xtype:'icheckbox',
							name:'f9',
							checked:false,
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'buy_flag'
							},
							id:'PAY_TYPE.input.f9'
						},{
							fieldLabel:'Print',
							xtype:'icheckbox',
							name:'f10',
							checked:false,
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'print_flag'
							},
							id:'PAY_TYPE.input.f10'
						},{
							fieldLabel:'Transfer',
							xtype:'icheckbox',
							name:'f11',
							checked:false,
							submit:'TENANT.input.panel',
							database:{
								table:'payment_type',
								field:'transfer_flag'
							},
							id:'PAY_TYPE.input.f11'
						},{
							xtype:'iinput',
							label : 'Percentage',
							items : [
								{
									xtype:'icheckbox',
									name:'f7',
									submit:'TENANT.input.panel',
									database:{
										table:'payment_type',
										field:'percentage_flag'
									},
									margin:false,
									listeners:{
										change:function(a){
											if(a.getValue()==true){
												Ext.getCmp('PAY_TYPE.input.f8').setReadOnly(false);
												Ext.getCmp('PAY_TYPE.input.f8')._setValue(0);
												Ext.getCmp('PAY_TYPE.input.f8').focus();
											}else{
												Ext.getCmp('PAY_TYPE.input.f8').setReadOnly(true);
												Ext.getCmp('PAY_TYPE.input.f8')._setValue(0);
											}
										}
									},
									id:'PAY_TYPE.input.f7'
								},{
									xtype:'displayfield',
									value:'&nbsp; Persen &nbsp;',
									margin:false,
								},{
									xtype:'inumberfield',
									name:'f8',
									submit:'TENANT.input.panel',
									database:{
										table:'payment_type',
										field:'percentage',
										type:'double'
									},
									width: 50,
									readOnly:true,
									margin:false,
									id:'PAY_TYPE.input.f8',
									allowBlank: false
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('PAY_TYPE.input.panel').qGetForm() == false)
					Ext.getCmp('PAY_TYPE.confirm').confirm({
						msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
						allow : 'PAY_TYPE.close',
						onY : function() {
							$this.qClose();

						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'PAY_TYPE.confirm'}
	]
});
