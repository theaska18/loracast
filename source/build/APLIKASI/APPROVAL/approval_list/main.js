/*
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
				Ext.getCmp('APPROVAL_LIST.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('APPROVAL_LIST.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('APPROVAL_LIST.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'APPROVAL_LIST.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'APPROVAL_LIST.search',
			modal:false,
			title:'Persetujuan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('APPROVAL_LIST.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('APPROVAL_LIST.search.f1').focus();
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
					id:'APPROVAL_LIST.search.btnSearch',
					handler: function() {
						Ext.getCmp('APPROVAL_LIST.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'APPROVAL_LIST.search.btnReset',
					handler: function() {
						Ext.getCmp('APPROVAL_LIST.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'APPROVAL_LIST.search.btnClose',
					handler: function() {
						Ext.getCmp('APPROVAL_LIST.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'APPROVAL_LIST.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f8',
							fieldLabel:'Kode Persetujuan',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},
							id:'APPROVAL_LIST.search.f8'
						},{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Nama Persetujuan',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},
							id:'APPROVAL_LIST.search.f1'
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
											_click('APPROVAL_LIST.search.btnSearch');
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
											_click('APPROVAL_LIST.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iemployee',
							name:'f5',
							value:eval(getSetting('APPROVAL_LIST','DEFAULT_EMPLOYEE')),
							fieldLabel:'Pengaju',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},
							id:'APPROVAL_LIST.search.f5'
						},{
							xtype:'iparameter',
							parameter:'APPROVAL',
							name : 'f6',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},
							fieldLabel: 'Status'
						},{
							xtype:'icomboquery',
							name:'f7',
							allowBlank: false,
							fieldLabel:'Jenis',
							query:'SELECT approval_flow_id AS id, approval_flow_name as text FROM app_approval_flow WHERE tenant_id='+_tenant_id+' ORDER BY approval_flow_name ASC',
							id:'APPROVAL_LIST.search.f7',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.search.btnSearch');
								}
							},
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'APPROVAL_LIST.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('APPROVAL_LIST.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('APPROVAL_LIST.dropdown').getValue()]=Ext.getCmp('APPROVAL_LIST.text').getValue();
					obj['f5']=_employee_id;
					return obj;
				}
			},
			url:url + 'cmd?m=APPROVAL_LIST&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('APPROVAL_LIST_DELETE',function(){
						Ext.getCmp('APPROVAL_LIST.confirm').confirm({
							msg : "Apakah akan Menghapus Artikel '"+a.f1+"' ?",
							allow : 'APPROVAL_LIST.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=APPROVAL_LIST&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('APPROVAL_LIST.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('APPROVAL_LIST.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											// socket.send('USERMODULE','APPROVAL_LIST','DELETE');
											Ext.getCmp('APPROVAL_LIST.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('APPROVAL_LIST.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('APPROVAL_LIST_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=APPROVAL_LIST&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('APPROVAL_LIST.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('APPROVAL_LIST.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('APPROVAL_LIST.input.panel').qReset();
									Ext.getCmp('APPROVAL_LIST.input.i').setValue(a.i);
									Ext.getCmp('APPROVAL_LIST.input.p').setValue('UPDATE');
									Ext.getCmp('APPROVAL_LIST.input.f1').setValue(a.f1);
									Ext.getCmp('APPROVAL_LIST.input.f1').setReadOnly(true);
									Ext.getCmp('APPROVAL_LIST.input.f6').setReadOnly(true);
									Ext.getCmp('APPROVAL_LIST.input.f2').setValue(a.f2);
									Ext.getCmp('APPROVAL_LIST.input.f3').setValue(a.f3);
									Ext.getCmp('APPROVAL_LIST.input.f5').setValue(o.f1);
									Ext.getCmp('APPROVAL_LIST.input.f6').setValue(o.f2);
									console.log(a);
									// Ext.getCmp('APPROVAL_LIST.input.f4').update(o.f3);
									Ext.getCmp('APPROVAL_LIST.input.f4').update('<iframe src="'+url+'viewer/#'+url+o.f4+'&session='+_session_id+'" style="width: 100%; height: 100%;"></iframe>');
					
									Ext.getCmp('APPROVAL_LIST.input').closing = false;
									Ext.getCmp('APPROVAL_LIST.list').hide();
									Ext.getCmp('APPROVAL_LIST.input').show();
									Ext.getCmp('APPROVAL_LIST.input.f2').focus();
									Ext.getCmp('APPROVAL_LIST.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('APPROVAL_LIST.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
				},
				
			},
			press:{
				delete:function(a){
					Ext.getCmp('APPROVAL_LIST.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('APPROVAL_LIST.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'}
			,
			// {
				// xtype:'iconfig',
				// id:'APPROVAL_LIST.config',
				// menuCode:'APPROVAL_LIST',
				// code:[
					// iif(_access('APPROVAL_LIST_config_SEQUENCE')==false,'SEQUENCE',null),
					// iif(_access('APPROVAL_LIST_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
					// iif(_access('APPROVAL_LIST_config_APPROVAL_SEQUENCE_CODE')==false,'APPROVAL_SEQUENCE_CODE',null)
				// ]
			// },
			'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'APPROVAL_LIST.btnAdd',
					iconCls:'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('APPROVAL_LIST.input.panel').qReset();
						Ext.getCmp('APPROVAL_LIST.input').closing = false;
						Ext.getCmp('APPROVAL_LIST.list').hide();
						Ext.getCmp('APPROVAL_LIST.input').show();
						if(getSetting('APPROVAL_LIST','SEQUENCE')=='Y'){
							Ext.getCmp('APPROVAL_LIST.input.f1').setReadOnly(true);
							Ext.getCmp('APPROVAL_LIST.input.f2').focus();
						}else{
							Ext.getCmp('APPROVAL_LIST.input.f1').setReadOnly(false);
							Ext.getCmp('APPROVAL_LIST.input.f1').focus();
						}
						Ext.getCmp('APPROVAL_LIST.input.p').setValue('ADD');
						Ext.getCmp('APPROVAL_LIST.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'APPROVAL_LIST.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'APPROVAL_LIST.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f8',text:'Kode Persetujuan'},
								{id:'f1',text:'Nama Persetujuan'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('APPROVAL_LIST.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'APPROVAL_LIST.text',
							press:{
								enter:function(){
									_click('APPROVAL_LIST.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'APPROVAL_LIST.btnSearch',
							handler : function(a) {
								Ext.getCmp('APPROVAL_LIST.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'APPROVAL_LIST.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('APPROVAL_LIST.search').show();
						Ext.getCmp('APPROVAL_LIST.search.f1').focus();
					}
				}
			],
			columns:[
				{ hidden: true, dataIndex: 'i' },
				{ text: 'Kode Persetujuan',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Persetujuan',flex:1, dataIndex: 'f2' },
				{ text: 'Pengaju',width: 200,dataIndex: 'f4'},
				{ text: 'Berlaku',xtype:'date',dataIndex: 'f6' },
				{ text: 'Status', width: 70,dataIndex: 'f5',align:'center'},
				{
					text: 'Persetujuan',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-list',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('APPROVAL_LIST.list').fn.update(record.data);
					}
				},{
					text: 'Lihat',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-eye',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('APPROVAL_LIST.list').fn.update(record.data);
					}
				}
			]
		},{
			id:'APPROVAL_LIST.input',
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
									_click('APPROVAL_LIST.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('APPROVAL_LIST.input.btnClose');
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
					xtype:'buttongroup',
					id:'APPROVAL.groupinput.search',
					items:[
						{
							xtype:'iparameter',
							parameter:'APPROVE',
							margin:false,
						},
						{
							text: 'Simpan',
							tooltip:'Simpan <b>[Ctrl+s]</b>',
							id:'APPROVAL_LIST.input.btnSave',
							iconCls:'fa fa-save',
							handler: function() {
								var req=Ext.getCmp('APPROVAL_LIST.input.panel').qGetForm(true);
								if(req == false){
									var param = Ext.getCmp('APPROVAL_LIST.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=APPROVAL_LIST&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('APPROVAL_LIST.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('APPROVAL_LIST.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												approval_next(r.d.approval_id,Ext.getCmp('APPROVAL_LIST.input'));
												Ext.getCmp('APPROVAL_LIST.list').refresh();
												Ext.getCmp('APPROVAL_LIST.input.i').setValue(r.d.id);
												Ext.getCmp('APPROVAL_LIST.input.p').setValue('UPDATE');
												Ext.getCmp('APPROVAL_LIST.input.f4').setValue(r.d.text);
												Ext.getCmp('APPROVAL_LIST.input.panel').qSetForm();
												// socket.send('USERMODULE','APPROVAL_LIST','SAVE');
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('APPROVAL_LIST.input').setLoading(false);
											ajaxError(jqXHR, exception);
										}
									});
								}else{
									if(Ext.getCmp('APPROVAL_LIST.input.p').getValue()=='ADD'){
										Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
									}else{
										Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
									}
								}
							}
						}
					]
				}
				,'->',{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'APPROVAL_LIST.input.btnClose',
					iconCls:'fa fa-arrow-right',
					handler: function() {
						var req=Ext.getCmp('APPROVAL_LIST.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('APPROVAL_LIST.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'APPROVAL_LIST.close',
								onY : function() {
									Ext.getCmp('APPROVAL_LIST.input').hide();
									Ext.getCmp('APPROVAL_LIST.list').show();
								}
							});
						}else{
							Ext.getCmp('APPROVAL_LIST.input').hide();
							Ext.getCmp('APPROVAL_LIST.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'APPROVAL_LIST.input.panel',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					paddingBottom:false,
					items:[
						{
							xtype:'panel',
							layout:'column',
							hidden:true,
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
											id:'APPROVAL_LIST.input.p'
										},{
											xtype:'ihiddenfield',
											name:'i',
											id:'APPROVAL_LIST.input.i'
										},{
											xtype:'itextfield',
											maxLength:30,
											width: 200,
											fieldLabel:'Code',
											name:'f1',
											property:{
												upper:true,
												space:false
											},
											id:'APPROVAL_LIST.input.f1',
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
											id:'APPROVAL_LIST.input.f2',
											allowBlank: false
										},{
											xtype:'itextarea',
											maxLength:256,
											width: 350,
											fieldLabel:'Description',
											name:'f3',
											id:'APPROVAL_LIST.input.f3',
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
											id:'APPROVAL_LIST.input.f5',
											allowBlank: false
										},{
											xtype:'icomboquery',
											name:'f6',
											allowBlank: false,
											fieldLabel:'Jenis',
											query:'SELECT approval_flow_id AS id, approval_flow_name as text FROM app_approval_flow WHERE tenant_id='+_tenant_id+' ORDER BY approval_flow_name ASC',
											id:'APPROVAL_LIST.input.f6',
										}
									]
								}
							]
						},{
							xtype:'panel',
							id:'APPROVAL_LIST.input.f4',
							name:'f4',
							border:false,
							flex:1,
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'APPROVAL_LIST.confirm'}
	]
});