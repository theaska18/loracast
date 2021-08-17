/*
	import cmp.ihtmleditor
	import cmp.ilistinput
	import cmp.idynamicoption
	import cmp.itextarea
	import cmp.ipanel
	import cmp.iconfig
	import cmp.iinput
	import cmp.itable
	import cmp.icombobox
	import cmp.icomboquery
	import cmp.idatefield
	import PARAMETER.iparameter
	import EMPLOYEE.iemployee
	import APPROVAL_FLOW.iapprovalflow
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('PLAN.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('PLAN.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('PLAN.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'PLAN.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'PLAN.search',
			modal:false,
			title:'Plan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('PLAN.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('PLAN.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('PLAN.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('PLAN.search.f1').focus();
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
					id:'PLAN.search.btnSearch',
					handler: function() {
						Ext.getCmp('PLAN.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'PLAN.search.btnReset',
					handler: function() {
						Ext.getCmp('PLAN.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'PLAN.search.btnClose',
					handler: function() {
						Ext.getCmp('PLAN.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PLAN.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f8',
							fieldLabel:'Kode Plan',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
							id:'PLAN.search.f8'
						},{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Plan',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
							id:'PLAN.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
							id:'PLAN.search.f2'
						},{
							xtype:'iinput',
							label : 'Berlaku',
							items : [
								{
									xtype:'idatefield',
									name : 'f3',
									margin:false,
									press:{
										enter:function(){
											_click('PLAN.search.btnSearch');
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
											_click('PLAN.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iemployee',
							name:'f5',
							value:eval(getSetting('PLAN','DEFAULT_EMPLOYEE')),
							fieldLabel:'Pembuat',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
							id:'PLAN.search.f5'
						},{
							xtype:'iparameter',
							parameter:'APPROVAL',
							name : 'f6',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
							fieldLabel: 'Status'
						},{
							xtype:'icomboquery',
							name:'f7',
							allowBlank: false,
							fieldLabel:'Jenis',
							query:'SELECT approval_flow_id AS id, approval_flow_name as text FROM app_approval_flow WHERE tenant_id='+_tenant_id+' ORDER BY approval_flow_name ASC',
							id:'PLAN.search.f7',
							press:{
								enter:function(){
									_click('PLAN.search.btnSearch');
								}
							},
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'PLAN.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('PLAN.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('PLAN.dropdown').getValue()]=Ext.getCmp('PLAN.text').getValue();
					obj['f5']=_employee_id;
					return obj;
				}
			},
			url:url + 'cmd?m=PLAN&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('PLAN_DELETE',function(){
						Ext.getCmp('PLAN.confirm').confirm({
							msg : "Apakah akan Menghapus Artikel '"+a.f1+"' ?",
							allow : 'PLAN.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=PLAN&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('PLAN.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('PLAN.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											// socket.send('USERMODULE','PLAN','DELETE');
											Ext.getCmp('PLAN.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('PLAN.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('PLAN_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=PLAN&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('PLAN.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('PLAN.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('PLAN.input.panel').qReset();
									Ext.getCmp('PLAN.input.i').setValue(a.i);
									Ext.getCmp('PLAN.input.p').setValue('UPDATE');
									Ext.getCmp('PLAN.input.f1').setValue(a.f1);
									Ext.getCmp('PLAN.input.f1').setReadOnly(true);
									Ext.getCmp('PLAN.input.f6').setReadOnly(true);
									Ext.getCmp('PLAN.input.f2').setValue(a.f2);
									Ext.getCmp('PLAN.input.f3').setValue(a.f3);
									Ext.getCmp('PLAN.input.f5').setValue(o.f1);
									Ext.getCmp('PLAN.input.f6').setValue(o.f2);
									Ext.getCmp('PLAN.input.f4').setValue(o.f3);
									Ext.getCmp('PLAN.input').closing = false;
									Ext.getCmp('PLAN.list').hide();
									Ext.getCmp('PLAN.input').show();
									Ext.getCmp('PLAN.input.f2').focus();
									Ext.getCmp('PLAN.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('PLAN.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
				},
			},
			press:{
				delete:function(a){
					Ext.getCmp('PLAN.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('PLAN.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'PLAN.config',
				menuCode:'PLAN',
				code:[
					iif(_access('PLAN_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('PLAN_config_APPROVAL_NAME')==false,'APPROVAL_NAME',null),
					iif(_access('PLAN_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
					iif(_access('PLAN_config_APPROVAL_SEQUENCE_CODE')==false,'APPROVAL_SEQUENCE_CODE',null)
				]
			},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'PLAN.btnAdd',
					iconCls:'fa fa-plus',
					handler:function(a){
						Ext.getCmp('PLAN.input.panel').qReset();
						Ext.getCmp('PLAN.input').closing = false;
						Ext.getCmp('PLAN.list').hide();
						Ext.getCmp('PLAN.input').show();
						if(getSetting('PLAN','SEQUENCE')=='Y'){
							Ext.getCmp('PLAN.input.f1').setReadOnly(true);
							Ext.getCmp('PLAN.input.f2').focus();
						}else{
							Ext.getCmp('PLAN.input.f1').setReadOnly(false);
							Ext.getCmp('PLAN.input.f1').focus();
						}
						Ext.getCmp('PLAN.input.f6').setReadOnly(false);
						Ext.getCmp('PLAN.input.p').setValue('ADD');
						Ext.getCmp('PLAN.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'PLAN.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'PLAN.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f8',text:'Kode Plan'},
								{id:'f1',text:'Plan'},
								{id:'f2',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('PLAN.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'PLAN.text',
							press:{
								enter:function(){
									_click('PLAN.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'PLAN.btnSearch',
							handler : function(a) {
								Ext.getCmp('PLAN.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'PLAN.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('PLAN.search').show();
						Ext.getCmp('PLAN.search.f1').focus();
					}
				}
			],
			columns:[
				{ hidden: true, dataIndex: 'i' },
				{ text: 'Kode Plan',width: 80, dataIndex: 'f1' },
				{ text: 'Plan',width: 200, dataIndex: 'f2' },
				{ text: 'Deskripsi',flex: 1, minWidth:200,dataIndex: 'f3' },
				{ text: 'Pembuat',width: 200,dataIndex: 'f4'},
				{ text: 'Berlaku',xtype:'date',dataIndex: 'f6' },
				{ text: 'Status', width: 70,dataIndex: 'f5',align:'center'},
				{
					text: 'Persetujuan',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-list',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PLAN.list').fn.update(record.data);
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PLAN.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PLAN.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'PLAN.input',
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
									_click('PLAN.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PLAN.input.btnClose');
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
					id:'PLAN.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('PLAN.input.panel').qGetForm(true);
						if(req == false){
							var param = Ext.getCmp('PLAN.input.panel').qParams();
							Ext.Ajax.request({
								url : url + 'cmd?m=PLAN&f=save',
								method : 'POST',
								params:param,
								before:function(){
									Ext.getCmp('PLAN.input').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('PLAN.input').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										approval_next(r.d.approval_id,Ext.getCmp('PLAN.input'));
										Ext.getCmp('PLAN.list').refresh();
										Ext.getCmp('PLAN.input.i').setValue(r.d.id);
										Ext.getCmp('PLAN.input.p').setValue('UPDATE');
										Ext.getCmp('PLAN.input.f4').setValue(r.d.text);
										Ext.getCmp('PLAN.input.panel').qSetForm();
										Ext.getCmp('PLAN.input.f6').setReadOnly(true);
										// socket.send('USERMODULE','PLAN','SAVE');
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('PLAN.input').setLoading(false);
									ajaxError(jqXHR, exception);
								}
							});
						}else{
							if(Ext.getCmp('PLAN.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				},'->',{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'PLAN.input.btnClose',
					iconCls:'fa fa-arrow-right',
					handler: function() {
						var req=Ext.getCmp('PLAN.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('PLAN.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'PLAN.close',
								onY : function() {
									Ext.getCmp('PLAN.input').hide();
									Ext.getCmp('PLAN.list').show();
								}
							});
						}else{
							Ext.getCmp('PLAN.input').hide();
							Ext.getCmp('PLAN.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PLAN.input.panel',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					paddingBottom:false,
					items:[
						{
							xtype:'panel',
							layout:'column',
							border:false,
							items:[
								{
									xtype:'panel',
									border:false,
									columnWidth: .33,
									items:[
										{
											xtype:'ihiddenfield',
											name:'p',
											id:'PLAN.input.p'
										},{
											xtype:'ihiddenfield',
											name:'i',
											id:'PLAN.input.i'
										},{
											xtype:'itextfield',
											maxLength:30,
											width: 250,
											fieldLabel:'Code',
											name:'f1',
											property:{
												upper:true,
												space:false
											},
											id:'PLAN.input.f1',
											allowBlank: false
										},{
											xtype:'itextfield',
											maxLength:60,
											width: 350,
											property:{
												dynamic:true
											},
											fieldLabel:'Name',
											name:'f2',
											id:'PLAN.input.f2',
											allowBlank: false
										},{
											xtype:'itextarea',
											maxLength:256,
											width: 350,
											fieldLabel:'Description',
											name:'f3',
											id:'PLAN.input.f3',
										}
									]
								},
								{
									xtype:'form',
									columnWidth: .33,
									border:false,
									minWidth:350,
									items:[
										{
											xtype:'idatefield',
											fieldLabel:'Tgl. Berlaku',
											name:'f5',
											id:'PLAN.input.f5',
											allowBlank: false
										},{
											xtype:'icomboquery',
											name:'f6',
											allowBlank: false,
											fieldLabel:'Jenis',
											query:'SELECT approval_flow_id AS id, approval_flow_name as text FROM app_approval_flow WHERE tenant_id='+_tenant_id+' ORDER BY approval_flow_name ASC',
											id:'PLAN.input.f6',
										}
									]
								}
							]
						},{
							xtype:'ihtmleditor',
							id:'PLAN.input.f4',
							name:'f4',
							flex:1,
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'PLAN.confirm'}
	]
});