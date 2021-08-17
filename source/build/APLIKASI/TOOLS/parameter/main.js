/*
	import cmp.ilistinput
	import cmp.itablegrid
	import cmp.icombobox
	import cmp.itextarea
	import cmp.ipanel
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				_click('PARAMETER.btnSearch');
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('PARAMETER.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('PARAMETER.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('PARAMETER.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'PARAMETER.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'PARAMETER.search',
			modal:false,
			title:'Parameter - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('PARAMETER.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('PARAMETER.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('PARAMETER.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('PARAMETER.search.f1').focus();
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
					id:'PARAMETER.search.btnSearch',
					handler: function() {
						Ext.getCmp('PARAMETER.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'PARAMETER.search.btnReset',
					handler: function() {
						Ext.getCmp('PARAMETER.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'PARAMETER.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('PARAMETER.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PARAMETER.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Parameter',
							database:{
								table:'app_parameter',
								field:'parameter_code',
								separator:'like'
							},
							id:'PARAMETER.search.f1',
							press:{
								enter:function(){
									_click('PARAMETER.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f2',
							database:{
								table:'app_parameter',
								field:'parameter_name',
								separator:'like'
							},
							fieldLabel:'Nama Parameter',
							id:'PARAMETER.search.f2',
							press:{
								enter:function(){
									_click('PARAMETER.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							database:{
								table:'app_parameter',
								field:'resume',
								separator:'like'
							},
							fieldLabel:'Resume',
							id:'PARAMETER.search.f3',
							press:{
								enter:function(){
									_click('PARAMETER.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'PARAMETER.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('PARAMETER.search.panel')._parameter();
				}else{
					var obj={};
					obj['app_parameter']={};
					obj['app_parameter'][Ext.getCmp('PARAMETER.dropdown').getValue()]={
						value:Ext.getCmp('PARAMETER.text').getValue(),
						separator:'like'
					};
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'app_parameter'
			},
			fn:{
				delete:function(a){
					_access('PARAMETER_DELETE',function(){
						if(a.F5 != true){
							Ext.getCmp('PARAMETER.confirm').confirm({
								msg : "Apakah Akan Menghapus Data Kode Parameter '"+a.parameter_code+"' ?",
								allow : 'PARAMETER.delete',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=PARAMETER&f=delete',
										method : 'POST',
										params : {
											i : a.parameter_code
										},
										before:function(){
											Ext.getCmp('PARAMETER.list').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('PARAMETER.list').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S')
												Ext.getCmp('PARAMETER.list').refresh();
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('PARAMETER.list').setLoading(false);
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
						Ext.getCmp('PARAMETER.list').hide();
						// Ext.getCmp('PARAMETER.input').setTitle('Parameter - Edit');
						Ext.getCmp('PARAMETER.input.p').setValue('UPDATE');
						Ext.getCmp('PARAMETER.input').show();
						Ext.getCmp('PARAMETER.input.parameterCode').setValue(a.parameter_code);
						Ext.getCmp('PARAMETER.input').closing = false;
						Ext.getCmp('PARAMETER.input.tableOption').resetTable();
						Ext.getCmp('PARAMETER.input.panel')._load(function(){
							var table=Ext.getCmp('PARAMETER.input.tableOption');
							for(var i=0,iLen=table._getTotal();i<iLen;i++){
								table._get('option_code',i).setReadOnly(true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('PARAMETER.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('PARAMETER.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Parameter</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'PARAMETER.btnAdd',
				iconCls: 'fa fa-plus fa-green',
				handler:function(a){
					Ext.getCmp('PARAMETER.input.tableOption').resetTable();
					Ext.getCmp('PARAMETER.input.panel').qReset();
					Ext.getCmp('PARAMETER.input.parameterCode').setReadOnly(false);
					Ext.getCmp('PARAMETER.input.p').setValue('ADD');
					Ext.getCmp('PARAMETER.input').closing = false;
					Ext.getCmp('PARAMETER.list').hide();
					Ext.getCmp('PARAMETER.input').show();
					// Ext.getCmp('PARAMETER.input').setTitle('Parameter - Tambah');
					Ext.getCmp('PARAMETER.input.parameterCode').focus();
					Ext.getCmp('PARAMETER.input.panel').qSetForm();
				}
			},{
				xtype:'buttongroup',
				hidden:_mobile,
				id:'PARAMETER.group.searching',
				items:[
					{
						xtype:'icombobox',
						id : 'PARAMETER.dropdown',
						emptyText:'Pencarian',
						margin:false,
						value:'parameter_name',
						data:[
							{id:'parameter_code',text:'Kode Parameter'},
							{id:'parameter_name',text:'Nama Parameter'},
							{id:'resume',text:'Resume'}
						],
						width: 150,
						press:{
							enter:function(){
								_click('PARAMETER.btnSearch');
							}
						}
					},{
						xtype:'itextfield',
						width: 200,
						emptyText:'Pencarian',
						id:'PARAMETER.text',
						margin:false,
						press:{
							enter:function(){
								_click('PARAMETER.btnSearch');
							}
						}
					},{
						iconCls: 'fa fa-search',
						id:'PARAMETER.btnSearch',
						handler : function(a) {
							Ext.getCmp('PARAMETER.list').refresh(false);
						}
					}
				]
			},{
				tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
				iconCls: 'fa fa-filter',
				id:'PARAMETER.btnShowSearch',
				handler:function(a){
					Ext.getCmp('PARAMETER.search').show();
					Ext.getCmp('PARAMETER.search.f1').focus();
				}
			}],
			columns:[
				{xtype:'rownumberer'},
				{ text: 'Kode Parameter',width: 150, dataIndex:'parameter_code',database:{field:'parameter_code'}},
				{ text: 'Nama Parameter',width: 200,dataIndex:'parameter_name',database:{field:'parameter_name'}},
				{ text: 'Resume',flex:1,minWidth:300, sortable:false,dataIndex:'resume',database:{field:'resume'}},
				{ hidden:true,dataIndex: 'system_flag' ,database:{field:'system_flag'}},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARAMETER.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARAMETER.list').fn.delete(record.raw);
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
			// title:'Parameter',
			id:'PARAMETER.input',
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
									_click('PARAMETER.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PARAMETER.input.btnClose');
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
						var req=Ext.getCmp('PARAMETER.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('PARAMETER.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'PARAMETER.close',
								onY : function() {
									Ext.getCmp('PARAMETER.input').hide();
									Ext.getCmp('PARAMETER.list').show();
								}
							});
						}else{
							Ext.getCmp('PARAMETER.input').hide();
							Ext.getCmp('PARAMETER.list').show();
						}
					}
				},'->','<b>Input Parameter</b>','->',{
					text: '<u>S</u>impan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'PARAMETER.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('PARAMETER.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PARAMETER.input.panel')._save(function(){
								Ext.getCmp('PARAMETER.input').hide();
								Ext.getCmp('PARAMETER.list').show();
								Ext.getCmp('PARAMETER.list').refresh();
							});
						else{
							if(Ext.getCmp('PARAMETER.input.p').getValue()=='ADD'){
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
					id : 'PARAMETER.input.panel',
					paddingBottom:false,
					submit:'PARAMETER.input.btnSave',
					database:{
						command:{
							app_parameter:{
								primary:'parameter_code',
								unique:[{field:'parameter_code',name:'Kode Parameter'}],
								value:[
									{
										field:'resume',
										type:'child',
										table:'app_parameter_option',
										value:['option_name','%, ']
										
									}
								]
							},
							app_parameter_option:{
								primary:'option_code',
								unique:[{field:'option_code',name:'Kode Opsi'}],
								parent:{
									field:'parameter_code',
									value:{
										table:'app_parameter',
										field:'parameter_code'
									}
								}
							}
						}
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'PARAMETER.input.p'
						},{
							xtype:'itextfield',
							maxLength:16,
							width:250,
							name:'f1',
							database:{
								table:'app_parameter',
								field:'parameter_code',
							},
							property:{
								upper:true,
								space:false
							},
							fieldLabel:'Parameter Code',
							submit:'PARAMETER.input.panel',
							id:'PARAMETER.input.parameterCode',
							result:'upper',
							allowBlank: false
						},{
							xtype:'itextfield',
							maxLength:32,
							width:350,
							submit:'PARAMETER.input.panel',
							property:{
								dynamic:true
							},
							database:{
								table:'app_parameter',
								field:'parameter_name'
							},
							name:'f2',
							fieldLabel:'Nama Parameter',
							id:'PARAMETER.input.parameterName',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f3',
							width:350,
							submit:'PARAMETER.input.panel',
							fieldLabel:'Deskripsi',
							database:{
								table:'app_parameter',
								field:'description'
							},
							id:'PARAMETER.input.description'
						},{
							xtype:'icheckbox',
							name:'f8',
							submit:'PARAMETER.input.panel',
							fieldLabel:'Sistem',
							checked:false,
							database:{
								table:'app_parameter',
								field:'system_flag',
								type:'boolean'
							},
							id:'PARAMETER.input.systemFlag'
						},{
							xtype:'ilistinput',
							id:'PARAMETER.input.tableOption',
							minHeight:200,
							anchor:'50%',
							minWidth:346,
							flex:1,
							database:{
								table:'app_parameter_option'
							},
							name:'options',
							items:[
								{
									xtype:'itextfield',
									name:'option_code',
									submit:'PARAMETER.input.panel',
									text:'Kode Opsi',
									database:{
										table:'app_parameter_option',
										field:'option_code'
									},
									emptyText:'Kode Opsi',
									allowBlank: false,
									width: 130,
									property	:{
										space:false,
										upper:true,
									}
								},{
									xtype:'itextfield',
									name:'option_name',
									text:'Nama Opsi',
									submit:'PARAMETER.input.panel',
									allowBlank: false,
									database:{
										table:'app_parameter_option',
										field:'option_name'
									},
									flex:1,
									emptyText:'Nama Opsi',
									property	:{
										dynamic:true
									}
								},{
									xtype:'icheckbox',
									name:'active_flag',
									submit:'PARAMETER.input.panel',
									width: 40,
									align:'center',
									value:true,
									checked:true,
									database:{
										table:'app_parameter_option',
										field:'active_flag',
										type:'boolean'
									},
									text:'Active'
								},{
									xtype:'icheckbox',
									name:'system_flag',
									submit:'PARAMETER.input.panel',
									width: 40,
									value:true,
									align:'center',
									checked:true,
									text:'System',
									database:{
										table:'app_parameter_option',
										field:'system_flag',
										type:'boolean'
									}
								}
							]
						}
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'PARAMETER.confirm'}
	]
});
