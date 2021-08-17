/*
	import cmp.ipanel
	import cmp.iconfig
	import cmp.icombobox
	import cmp.itablegrid
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_UNIT.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_UNIT.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_UNIT.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_UNIT.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_UNIT.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_UNIT.search',
			modal:false,
			title:'Unit - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_UNIT.search.btnClose');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_UNIT.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_UNIT.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_UNIT.search.f1').focus();
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
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'INV_UNIT.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_UNIT.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'INV_UNIT.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_UNIT.search.panel').qReset();
					}
				},{
					text:'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'INV_UNIT.search.btnClose',
					handler: function() {
						Ext.getCmp('INV_UNIT.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_UNIT.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Kode Unit',
							id:'INV_UNIT.search.f6',
							database:{
								table:'inv_unit',
								field:'unit_code',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('INV_UNIT.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f1',
							database:{
								table:'inv_unit',
								field:'unit_name',
								separator:'like'
							},
							fieldLabel:'Nama Unit',
							press:{
								enter:function(){
									_click('INV_UNIT.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							name : 'f3',
							fieldLabel: 'Jenis Unit',
							database:{
								table:'inv_unit',
								field:'jenis_unit'
							},
							parameter:'INV_UNIT_TYPE',
							press:{
								enter:function(){
									_click('INV_UNIT.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							database:{
								table:'inv_unit',
								field:'M.active_flag',
								type:'active'
							},
							name : 'f5',
							width:200,
							press:{
								enter:function(){
									_click('INV_UNIT.search.btnSearch');
								}
							},
							fieldLabel:'Aktif',
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'INV_UNIT.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_UNIT.search.panel')._parameter();
					arr['inv_unit']['M.tenant_id']={
						value:_tenant_id,
						type:'double',
						separator:'='
					}
					return arr;
				}else{
					var obj={};
					obj['inv_unit']={};
					obj['inv_unit'][Ext.getCmp('INV_UNIT.dropdown').getValue()]={
						value:Ext.getCmp('INV_UNIT.text').getValue(),
						separator:'like'
					};
					obj['inv_unit']['M.active_flag']={
						value:true,
						type:'boolean',
						separator:'='
					}
					obj['inv_unit']['M.tenant_id']={
						value:_tenant_id,
						type:'double',
						separator:'='
					}
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'inv_unit',
				inner:'INNER JOIN app_parameter_option UNIT ON UNIT.option_code=M.unit_type'
			},
			fn:{
				delete:function(a){
					_access('INV_UNIT_delete',function(){
						Ext.getCmp('INV_UNIT.confirm').confirm({
							msg : "Apakah Akan Menghapus Kode Unit '"+a.unit_code+"' ?",
							allow : 'INV_UNIT.delete',
							onY : function() {
								Ext.Ajax.request({
									url : _url('INV_UNIT','delete'),
									method : 'POST',
									params : {
										i : a.unit_id
									},
									before:function(){
										Ext.getCmp('INV_UNIT.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_UNIT.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_UNIT.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_UNIT.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_UNIT_update',function(){
						Ext.getCmp('INV_UNIT.list').hide();
						Ext.getCmp('INV_UNIT.input').show();
						Ext.getCmp('INV_UNIT.input.i').setValue(a.unit_id);
						Ext.getCmp('INV_UNIT.input.panel')._load(function(){
							Ext.getCmp('INV_UNIT.input.update_by').setValue(_employee_id);
							Ext.getCmp('INV_UNIT.input.update_on').setValue('now()');
							Ext.getCmp('INV_UNIT.input.panel').qSetForm();
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_UNIT.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_UNIT.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Unit</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'INV_UNIT.config',
					menuCode:'INV_UNIT',
					code:[
						iif(_access('INV_UNIT_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('INV_UNIT_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
					]
				},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					iconCls: 'fa fa-plus fa-green',
					id:'INV_UNIT.btnAdd',
					handler:function(a){
						Ext.getCmp('INV_UNIT.input.panel').qReset();
						Ext.getCmp('INV_UNIT.list').hide();
						Ext.getCmp('INV_UNIT.input').show();
						if(getSetting('INV_UNIT','SEQUENCE')=='Y'){
							Ext.getCmp('INV_UNIT.input.f1').setReadOnly(true);
							Ext.getCmp('INV_UNIT.input.f1').database.sequence=getSetting('INV_UNIT','SEQUENCE_CODE');
							Ext.getCmp('INV_UNIT.input.f2').focus();
						}else{
							Ext.getCmp('INV_UNIT.input.f1').setReadOnly(false);
							Ext.getCmp('INV_UNIT.input.f1').database.sequence='';
							Ext.getCmp('INV_UNIT.input.f1').focus();
						}
						Ext.getCmp('INV_UNIT.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					hidden:_mobile,
					id:'INV_UNIT.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'INV_UNIT.dropdown',
							emptyText:'Pencarian',
							value:'nama_unit',
							margin:false,
							data:[
								{id:'nama_unit',text:'Nama Unit'},
								{id:'unit_code',text:'Kode Unit'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('INV_UNIT.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'INV_UNIT.text',
							press:{
								enter:function(){
									_click('INV_UNIT.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'INV_UNIT.btnSearch',
							handler : function(a) {
								Ext.getCmp('INV_UNIT.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					iconCls: 'fa fa-filter',
					id:'INV_UNIT.btnShowSearch',
					handler:function(a){
						Ext.getCmp('INV_UNIT.search').show();
						Ext.getCmp('INV_UNIT.search.f6').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'unit_id',database:{field:'unit_id'} },
				{ text: 'Kode Unit',width: 150, align:'center',dataIndex: 'unit_code',database:{field:'unit_code'}  },
				{ text: 'Nama Unit',width:200, dataIndex: 'unit_name',database:{field:'unit_name'}  },
				{ text: 'Jenis Unit',width: 100, dataIndex: 'jenis',database:{field:'UNIT.option_name AS jenis'}  },
				{ xtype:'active',dataIndex: 'active_flag',database:{field:'M.active_flag'} 
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_UNIT.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_UNIT.list').fn.delete(record.data);
					}
				}
			]
		},{
			hidden 	: true,
			border:false,
			id:'INV_UNIT.input',
			tbar: [
				{
					text: 'Kembali',
					iconCls : 'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_UNIT.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_UNIT.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_UNIT.close',
								onY : function() {
									Ext.getCmp('INV_UNIT.input').hide();
									Ext.getCmp('INV_UNIT.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_UNIT.input').hide();
							Ext.getCmp('INV_UNIT.list').show();
						}
						
					}
				},'->','<b>Input Unit</b>','->',{
					text: 'Simpan',
					id:'INV_UNIT.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('INV_UNIT.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('INV_UNIT.input.panel')._save(function(){
								Ext.getCmp('INV_UNIT.input').hide();
								Ext.getCmp('INV_UNIT.list').show();
								Ext.getCmp('INV_UNIT.list').refresh(false);
							});
						else if(req==true){
							Ext.getCmp('INV_UNIT.input').hide();
							Ext.getCmp('INV_UNIT.list').show();
						}
					}
				}
			],
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_UNIT.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_UNIT.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			items:[
				{
					xtype:'ipanel',
					id : 'INV_UNIT.input.panel',
					submit:'INV_UNIT.input.btnSave',
					width: 350,
					database:{
						command:{
							inv_unit:{
								primary:'unit_id',
								unique:[{field:'tenant_id',type:'double'},{field:'unit_code',name:'Kode Unit'}]
							}
						}
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'INV_UNIT.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'INV_UNIT.input.i',
							database:{
								table:'inv_unit',
								field:'unit_id',
								type:'double'
							}
						},{
							xtype:'ihiddenfield',
							name:'tenant_id',
							value:_tenant_id,
							id:'INV_UNIT.input.tenant_id',
							database:{
								table:'inv_unit',
								field:'tenant_id',
								type:'double'
							}
						},{
							xtype:'ihiddenfield',
							name:'update_by',
							value:null,
							id:'INV_UNIT.input.update_by',
							database:{
								table:'inv_unit',
								field:'update_by',
								type:'double'
							}
						},{
							xtype:'ihiddenfield',
							name:'create_by',
							value:_employee_id,
							id:'INV_UNIT.input.create_by',
							database:{
								table:'inv_unit',
								field:'create_by',
								type:'double'
							}
						},{
							xtype:'ihiddenfield',
							name:'create_on',
							value:'now()',
							id:'INV_UNIT.input.create_on',
							database:{
								table:'inv_unit',
								field:'create_on',
								type:'datetime'
							}
						},{
							xtype:'ihiddenfield',
							name:'update_on',
							value:'now()',
							id:'INV_UNIT.input.update_on',
							database:{
								table:'inv_unit',
								field:'update_on',
								type:'datetime'
							}
						},{
							xtype:'itextfield',
							maxLength:32,
							name:'f1',
							submit:'INV_UNIT.input.panel',
							fieldLabel:'Kode Unit',
							database:{
								table:'inv_unit',
								field:'unit_code'
							},
							id:'INV_UNIT.input.f1',
							allowBlank: false,
							property:{
								upper:true,
								space:false
							}
						},{
							xtype:'itextfield',
							name:'f2',
							submit:'INV_UNIT.input.panel',
							fieldLabel:'Nama Unit',
							database:{
								table:'inv_unit',
								field:'unit_name'
							},
							id:'INV_UNIT.input.f2',
							allowBlank: false,
							property:{
								dynamic:true
							}
						}, {
							xtype:'iparameter',
							id : 'INV_UNIT.search.f4',
							name : 'f4',
							submit:'INV_UNIT.input.panel',
							allowBlank: false,
							fieldLabel:'Jenis Unit',
							database:{
								table:'inv_unit',
								field:'unit_type'
							},
							parameter:'INV_UNIT_TYPE'
						},{
							xtype:'icheckbox',
							name:'f5',
							fieldLabel:'Aktif',
							checked:true,
							submit:'INV_UNIT.input.panel',
							database:{
								table:'inv_unit',
								field:'active_flag'
							},
							id:'INV_UNIT.input.f5'
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_UNIT.input.panel').qGetForm() == false)
					Ext.getCmp('INV_UNIT.confirm').confirm({
						msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
						allow : 'INV_UNIT.close',
						onY : function() {
							$this.qClose();

						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_UNIT.confirm'}
	]
});
