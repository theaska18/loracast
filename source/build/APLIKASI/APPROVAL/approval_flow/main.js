/*
	import EMPLOYEE.iemployee
	import PARAMETER.iparameter
	import cmp.ipanel
	import cmp.icomboquery
	import cmp.icombobox
	import cmp.itablegrid
	import cmp.itextarea
	import cmp.ilistinput
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				_click('APPROVAL_FLOW.btnSearch');
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('APPROVAL_FLOW.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('APPROVAL_FLOW.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('APPROVAL_FLOW.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'APPROVAL_FLOW.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'APPROVAL_FLOW.search',
			modal:false,
			title:'Alur Persetujuan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('APPROVAL_FLOW.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('APPROVAL_FLOW.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('APPROVAL_FLOW.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('APPROVAL_FLOW.search.f1').focus();
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
					id:'APPROVAL_FLOW.search.btnSearch',
					handler: function() {
						Ext.getCmp('APPROVAL_FLOW.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'APPROVAL_FLOW.search.btnReset',
					handler: function() {
						Ext.getCmp('APPROVAL_FLOW.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'APPROVAL_FLOW.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('APPROVAL_FLOW.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'APPROVAL_FLOW.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Alur',
							database:{
								table:'app_approval_flow',
								field:'approval_flow_code',
								separator:'like'
							},
							id:'APPROVAL_FLOW.search.f1',
							press:{
								enter:function(){
									_click('APPROVAL_FLOW.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f2',
							database:{
								table:'app_approval_flow',
								field:'approval_flow_name',
								separator:'like'
							},
							fieldLabel:'Nama Alur',
							id:'APPROVAL_FLOW.search.f2',
							press:{
								enter:function(){
									_click('APPROVAL_FLOW.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							database:{
								table:'app_approval_flow',
								field:'resume',
								separator:'like'
							},
							fieldLabel:'Deskripsi',
							id:'APPROVAL_FLOW.search.f3',
							press:{
								enter:function(){
									_click('APPROVAL_FLOW.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'APPROVAL_FLOW.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('APPROVAL_FLOW.search.panel')._parameter();
				}else{
					var obj={};
					obj['app_parameter']={};
					obj['app_parameter'][Ext.getCmp('APPROVAL_FLOW.dropdown').getValue()]={
						value:Ext.getCmp('APPROVAL_FLOW.text').getValue(),
						separator:'like'
					};
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'app_approval_flow'
			},
			fn:{
				delete:function(a){
					_access('PARAMETER_DELETE',function(){
						if(a.F5 != true){
							Ext.getCmp('APPROVAL_FLOW.confirm').confirm({
								msg : "Apakah Akan Menghapus Data Kode Alur Persetujuan '"+a.approval_flow_code+"' ?",
								allow : 'APPROVAL_FLOW.delete',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=APPROVAL_FLOW&f=delete',
										method : 'POST',
										params : {
											i : a.approval_flow_id
										},
										before:function(){
											Ext.getCmp('APPROVAL_FLOW.list').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('APPROVAL_FLOW.list').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S')
												Ext.getCmp('APPROVAL_FLOW.list').refresh();
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('APPROVAL_FLOW.list').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						}
					});
				},
				update:function(a){
					_access('PARAMETER_UPDATE',function(){
						Ext.getCmp('APPROVAL_FLOW.list').hide();
						Ext.getCmp('APPROVAL_FLOW.input.p').setValue('UPDATE');
						Ext.getCmp('APPROVAL_FLOW.input').show();
						Ext.getCmp('APPROVAL_FLOW.input.f4').setValue(a.approval_flow_id);
						Ext.getCmp('APPROVAL_FLOW.input').closing = false;
						Ext.getCmp('APPROVAL_FLOW.input.tableOption').resetTable();
						Ext.getCmp('APPROVAL_FLOW.input.tablePic').resetTable();
						Ext.getCmp('APPROVAL_FLOW.input.tablePic')._add();
						Ext.getCmp('APPROVAL_FLOW.input.panel')._load(function(){
							var table=Ext.getCmp('APPROVAL_FLOW.input.tableOption');
							Ext.getCmp('APPROVAL_FLOW.input.f9').setValue('now()');
							for(var i=0,iLen=table._getTotal();i<iLen;i++){
								table._get('f13',i).setValue('now()');
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('APPROVAL_FLOW.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('APPROVAL_FLOW.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'APPROVAL_FLOW.btnAdd',
				iconCls: 'fa fa-plus fa-green',
				handler:function(a){
					Ext.getCmp('APPROVAL_FLOW.input.tableOption').resetTable();
					Ext.getCmp('APPROVAL_FLOW.input.panel').qReset();
					Ext.getCmp('APPROVAL_FLOW.input.parameterCode').setReadOnly(false);
					Ext.getCmp('APPROVAL_FLOW.input.p').setValue('ADD');
					Ext.getCmp('APPROVAL_FLOW.input').closing = false;
					Ext.getCmp('APPROVAL_FLOW.list').hide();
					Ext.getCmp('APPROVAL_FLOW.input').show();
					Ext.getCmp('APPROVAL_FLOW.input.parameterCode').focus();
					Ext.getCmp('APPROVAL_FLOW.input.panel').qSetForm();
				}
			},{
				xtype:'buttongroup',
				id:'APPROVAL_FLOW.group.searching',
				items:[
					{
						xtype:'icombobox',
						id : 'APPROVAL_FLOW.dropdown',
						emptyText:'Pencarian',
						margin:false,
						value:'parameter_name',
						data:[
							{id:'approval_flow_code',text:'Kode Persetujuan'},
							{id:'approval_flow_name',text:'Nama Persetujuan'},
							{id:'description',text:'Deskripsi'}
						],
						width: 150,
						press:{
							enter:function(){
								_click('APPROVAL_FLOW.btnSearch');
							}
						}
					},{
						xtype:'itextfield',
						width: 200,
						emptyText:'Pencarian',
						id:'APPROVAL_FLOW.text',
						margin:false,
						press:{
							enter:function(){
								_click('APPROVAL_FLOW.btnSearch');
							}
						}
					},{
						iconCls: 'fa fa-search',
						id:'APPROVAL_FLOW.btnSearch',
						handler : function(a) {
							Ext.getCmp('APPROVAL_FLOW.list').refresh(false);
						}
					}
				]
			},{
				tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
				iconCls: 'fa fa-filter',
				id:'APPROVAL_FLOW.btnShowSearch',
				handler:function(a){
					Ext.getCmp('APPROVAL_FLOW.search').show();
					Ext.getCmp('APPROVAL_FLOW.search.f1').focus();
				}
			}],
			columns:[
				{xtype:'rownumberer'},
				{ hidden:true,dataIndex: 'approval_flow_id',database:{field:'approval_flow_id'} },
				{ text: 'Kode Alur',width: 120, dataIndex:'approval_flow_code',database:{field:'approval_flow_code'}},
				{ text: 'Nama Alur',width: 150,dataIndex:'approval_flow_name',database:{field:'approval_flow_name'}},
				{ text: 'Deskripsi',flex: 1, dataIndex:'description',database:{field:'description'}},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('APPROVAL_FLOW.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('APPROVAL_FLOW.list').fn.delete(record.raw);
					},
					isDisabled : function(view, rowIdx, colIdx, item, record) {
						if(record.data.f5==true)
							return true;
						else
							return false;
					}
				}
			]
		},{
			id:'APPROVAL_FLOW.input',
			hidden:true,
			border:false,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('APPROVAL_FLOW.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('APPROVAL_FLOW.input.btnClose');
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
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('APPROVAL_FLOW.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('APPROVAL_FLOW.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'APPROVAL_FLOW.close',
								onY : function() {
									Ext.getCmp('APPROVAL_FLOW.input').hide();
									Ext.getCmp('APPROVAL_FLOW.list').show();
								}
							});
						}else{
							Ext.getCmp('APPROVAL_FLOW.input').hide();
							Ext.getCmp('APPROVAL_FLOW.list').show();
						}
					}
				},'->','<b>Alur Persetujuan</b>','->',{
					text: '<u>S</u>impan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'APPROVAL_FLOW.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('APPROVAL_FLOW.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('APPROVAL_FLOW.input.panel')._save(function(){
								Ext.getCmp('APPROVAL_FLOW.input').hide();
								Ext.getCmp('APPROVAL_FLOW.list').show();
								Ext.getCmp('APPROVAL_FLOW.list').refresh();
							});
						else{
							if(Ext.getCmp('APPROVAL_FLOW.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			autoScroll: true,
			items:[
				{
					xtype:'ipanel',
					id : 'APPROVAL_FLOW.input.panel',
					submit:'APPROVAL_FLOW.input.btnSave',
					paddingBottom:false,
					database:{
						command:{
							app_approval_flow:{
								primary:'approval_flow_id',
								unique:[{field:'approval_flow_code',name:'Kode Persetujuan'},{field:'tenant_id',name:'Penyewa'}],
								// value:[
									// {
										// field:'resume',
										// type:'child',
										// table:'app_parameter_option',
										// value:['option_code','% - ','option_name','%, ']
										
									// }
								// ]
							},
							app_approval_flow_detail:{
								primary:'approval_flow_detail_id',
								// unique:[{field:'option_code',name:'Kode Opsi'}],
								parent:{
									field:'approval_flow_id',
									value:{
										table:'app_approval_flow',
										field:'approval_flow_id'
									}
								}
							},
							app_approval_flow_pic:{
								primary:'pic_id',
								// unique:[{field:'option_code',name:'Kode Opsi'}],
								parent:{
									field:'approval_flow_id',
									value:{
										table:'app_approval_flow',
										field:'approval_flow_id'
									}
								}
							}
						}
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'APPROVAL_FLOW.input.p'
						},{
							xtype:'ihiddenfield',
							name:'f4',
							database:{
								table:'app_approval_flow',
								field:'approval_flow_id',
							},
							id:'APPROVAL_FLOW.input.f4'
						},{
							xtype:'ihiddenfield',
							name:'f5',
							database:{
								table:'app_approval_flow',
								field:'tenant_id',
								type:'double'
							},
							value:_tenant_id,
							id:'APPROVAL_FLOW.input.tenantId'
						},{
							xtype:'ihiddenfield',
							name:'f6',
							database:{
								table:'app_approval_flow',
								field:'update_by',
								type:'double'
							},
							value:_employee_id,
							id:'APPROVAL_FLOW.input.f6'
						},{
							xtype:'ihiddenfield',
							name:'f7',
							database:{
								table:'app_approval_flow',
								field:'create_by',
								type:'double'
							},
							value:_employee_id,
							id:'APPROVAL_FLOW.input.f7'
						},{
							xtype:'ihiddenfield',
							name:'f8',
							database:{
								table:'app_approval_flow',
								field:'create_on',
								type:'datetime'
							},
							value:'now()',
							id:'APPROVAL_FLOW.input.f8'
						},{
							xtype:'ihiddenfield',
							name:'f9',
							database:{
								table:'app_approval_flow',
								field:'update_on',
								type:'datetime'
							},
							value:'now()',
							id:'APPROVAL_FLOW.input.f9'
						},{
							xtype:'itextfield',
							submit:'APPROVAL_FLOW.input.panel',
							maxLength:32,
							width:250,
							name:'f1',
							database:{
								table:'app_approval_flow',
								field:'approval_flow_code',
							},
							property:{
								upper:true,
								space:false
							},
							fieldLabel:'Kode Persetujuan',
							id:'APPROVAL_FLOW.input.parameterCode',
							result:'upper',
							allowBlank: false
						},{
							xtype:'itextfield',
							submit:'APPROVAL_FLOW.input.panel',
							maxLength:32,
							width:350,
							property:{
								dynamic:true
							},
							database:{
								table:'app_approval_flow',
								field:'approval_flow_name'
							},
							name:'f2',
							fieldLabel:'Nama Persetujuan',
							id:'APPROVAL_FLOW.input.parameterName',
							allowBlank: false
						},{
							xtype:'itextarea',
							submit:'APPROVAL_FLOW.input.panel',
							name:'f3',
							width:350,
							fieldLabel:'Deskripsi',
							database:{
								table:'app_approval_flow',
								field:'description'
							},
							id:'APPROVAL_FLOW.input.description'
						},{
							xtype:'panel',
							minHeight:200,
							anchor:'50%',
							border:false,
							title:'Alur Persetujuan',
							minWidth:346,
							flex:1,
							autoScroll:true,
							items:[
								{
									xtype:'ilistinput',
									id:'APPROVAL_FLOW.input.tableOption',
									database:{
										table:'app_approval_flow_detail'
									},
									name:'options',
									items:[
										{
											xtype:'ihiddenfield',
											name:'f14',
											database:{
												table:'app_approval_flow_detail',
												field:'approval_flow_detail_id',
											}
										},{
											xtype:'ihiddenfield',
											name:'f10',
											database:{
												table:'app_approval_flow_detail',
												field:'update_by',
												type:'double'
											},
											value:_employee_id,
										},{
											xtype:'ihiddenfield',
											name:'f11',
											database:{
												table:'app_approval_flow_detail',
												field:'create_by',
												type:'double'
											},
											value:_employee_id,
										},{
											xtype:'ihiddenfield',
											name:'f12',
											database:{
												table:'app_approval_flow_detail',
												field:'create_on',
												type:'datetime'
											},
											value:'now()',
										},{
											xtype:'ihiddenfield',
											name:'f13',
											database:{
												table:'app_approval_flow_detail',
												field:'update_on',
												type:'datetime'
											},
											value:'now()',
										},{
											xtype:'iparameter',
											submit:'APPROVAL_FLOW.input.panel',
											name:'flow_type',
											text:'Jns. Persetujuan',
											parameter:'APPROVAL_TYPE',
											listeners:{
												change:function(a){
													var tbl=Ext.getCmp('APPROVAL_FLOW.input.tableOption');
													tbl._get('structure_id',a.line).setValue(null);
													tbl._get('employee_id',a.line).setValue(null);
													tbl._get('structure_id',a.line).setReadOnly(true);
													tbl._get('employee_id',a.line).setReadOnly(true);
													if(a.getValue()=='APPROVAL_TYPE_ORGANIZATION'){
														tbl._get('structure_id',a.line).setReadOnly(false);
													}else if(a.getValue()=='APPROVAL_TYPE_EMPLOYEE'){
														tbl._get('employee_id',a.line).setReadOnly(false);
													}
												}
											},
											database:{
												table:'app_approval_flow_detail',
												field:'flow_type'
											},
											emptyText:'Jenis Persetujuan',
											allowBlank: false,
											width: 130,
										},{
											xtype:'icomboquery',
											text:'Struktur',
											submit:'APPROVAL_FLOW.input.panel',
											width: 180,
											readOnly:true,
											allowBlank: false,
											name : 'structure_id',
											database:{
												table:'app_approval_flow_detail',
												field:'structure_id',
												type:'double'
											},
											query:"SELECT structure_id AS id,CONCAT(structure_code,' - ',structure_name) AS text FROM org_structure WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY structure_name ASC"
										},{
											xtype:'iemployee',
											database:{
												table:'app_approval_flow_detail',
												field:'employee_id',
												type:'double'
											},
											text:'Karyawan',
											fieldLabel:null,
											submit:'APPROVAL_FLOW.input.panel',
											width: 180,
											readOnly:true,
											name:'employee_id',
										}
									]
								}
							]
						},{
							xtype:'panel',
							minHeight:200,
							anchor:'50%',
							border:false,
							title:'PIC',
							minWidth:346,
							autoScroll:true,
							flex:1,
							items:[
								{
									xtype:'ilistinput',
									id:'APPROVAL_FLOW.input.tablePic',
									database:{
										table:'app_approval_flow_pic'
									},
									addLine:false,
									name:'options',
									items:[
										{
											xtype:'ihiddenfield',
											name:'f14',
											database:{
												table:'app_approval_flow_pic',
												field:'pic_id',
											}
										},{
											xtype:'iemployee',
											database:{
												table:'app_approval_flow_pic',
												field:'employee_id',
												type:'double'
											},
											text:'Karyawan',
											fieldLabel:null,
											submit:'APPROVAL_FLOW.input.panel',
											width: 180,
											name:'employee_id',
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'APPROVAL_FLOW.confirm'}
	]
});
