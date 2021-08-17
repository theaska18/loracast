/*
	import cmp.ipanel
	import cmp.itable
	import cmp.icombobox
	import cmp.itextarea
	import cmp.ilistinput
	import cmp.icomboquery
	import cmp.ifotoupload
	import cmp.inumberfield
	import cmp.iconfig
	import cmp.iinput
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('ITEM.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('ITEM.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('ITEM.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('ITEM.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'ITEM.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'ITEM.search',
			modal:false,
			title:'Barang - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('ITEM.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('ITEM.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('ITEM.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('ITEM.search.f1').focus();
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
					id:'ITEM.search.btnSearch',
					handler: function() {
						Ext.getCmp('ITEM.list').refresh();
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'ITEM.search.btnReset',
					handler: function() {
						Ext.getCmp('ITEM.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'ITEM.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('ITEM.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'ITEM.export',
							onY : function() {
								window.open(url+'cmd?m=ITEM&f=toExcel&session='+_session_id+serialize(Ext.getCmp('ITEM.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('ITEM.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'ITEM.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							},
							id:'ITEM.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Barcode',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f7',
							fieldLabel:'ID Produk',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f8',
							fieldLabel:'Kode Produk',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								}
							},
						},{
							xtype:'iparameter',
							parameter:'ITEM_TYPE',
							name : 'f4',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
								},
							},
							fieldLabel:'Jenis Barang'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f5',
							press:{
								enter:function(){
									_click('ITEM.search.btnSearch');
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
			id:'ITEM.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('ITEM.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('ITEM.dropdown').getValue()]=Ext.getCmp('ITEM.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=ITEM&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('ITEM_DELETE',function(){
						Ext.getCmp('ITEM.confirm').confirm({
							msg : 'Apakah akan menghapus Kode Barang '+a.f1,
							allow : 'ITEM.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=ITEM&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('ITEM.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('ITEM.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('ITEM.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('ITEM.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('ITEM_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=ITEM&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('ITEM.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('ITEM.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									var l=r.d.l;
									Ext.getCmp('ITEM.input.panel').qReset();
									Ext.getCmp('ITEM.list').hide();
									Ext.getCmp('ITEM.input').show();
									Ext.getCmp('ITEM.input.f17').setNull();
									Ext.getCmp('ITEM.input.f1').setValue(a.f1);
									Ext.getCmp('ITEM.input.f2').setValue(a.f2);
									Ext.getCmp('ITEM.input.f3').setValue(o.f3);
									Ext.getCmp('ITEM.input.f4').setValue(o.f4);
									Ext.getCmp('ITEM.input.f5').setValue(o.f5);
									Ext.getCmp('ITEM.input.f22').setValue(o.f22);
									Ext.getCmp('ITEM.input.f4').setReadOnly(false);
									
									Ext.getCmp('ITEM.input.f10').setReadOnly(true);
									Ext.getCmp('ITEM.input.f11').setReadOnly(true);
									Ext.getCmp('ITEM.input.f12').setReadOnly(true);
									Ext.getCmp('ITEM.input.f13').setReadOnly(true);
									Ext.getCmp('ITEM.input.f14').setReadOnly(true);
									Ext.getCmp('ITEM.input.f15').setReadOnly(true);
									Ext.getCmp('ITEM.input.f19').setReadOnly(true);
									Ext.getCmp('ITEM.input.f16').setReadOnly(true);
									Ext.getCmp('ITEM.input.f18').setReadOnly(true);
									Ext.getCmp('ITEM.input.f20').setReadOnly(true);
									Ext.getCmp('ITEM.input.f21').setReadOnly(true);
									Ext.getCmp('ITEM.input.f23').setReadOnly(true);
									Ext.getCmp('ITEM.input.f17').input=false;
									if(o.f4=='ITEMTYPE_BARANG'){
										Ext.getCmp('ITEM.input.f10').setReadOnly(false);
										Ext.getCmp('ITEM.input.f12').setReadOnly(false);
										Ext.getCmp('ITEM.input.f13').setReadOnly(false);
										Ext.getCmp('ITEM.input.f14').setReadOnly(false);
										Ext.getCmp('ITEM.input.f15').setReadOnly(false);
										Ext.getCmp('ITEM.input.f19').setReadOnly(false);
										Ext.getCmp('ITEM.input.f20').setReadOnly(false);
										Ext.getCmp('ITEM.input.f21').setReadOnly(false);
										Ext.getCmp('ITEM.input.f23').setReadOnly(false);
										Ext.getCmp('ITEM.input.f18').setReadOnly(false);
										Ext.getCmp('ITEM.input.f17').input=true;
										Ext.getCmp('ITEM.input.f10').setValue(o.f10);
										Ext.getCmp('ITEM.input.f11')._setValue(o.f11);
										Ext.getCmp('ITEM.input.f12').setValue(o.f12);
										Ext.getCmp('ITEM.input.f13').setValue(o.f13);
										Ext.getCmp('ITEM.input.f14').setValue(o.f14);
										Ext.getCmp('ITEM.input.f15').setValue(o.f15);
										Ext.getCmp('ITEM.input.f19').setValue(o.f19);
										Ext.getCmp('ITEM.input.f20').setValue(o.f20);
										Ext.getCmp('ITEM.input.f21').setValue(o.f21);
										Ext.getCmp('ITEM.input.f24').setValue(o.f24);
										Ext.getCmp('ITEM.input.f23').setValue(o.f23);
										Ext.getCmp('ITEM.input.f18').setValue(o.f18);
										Ext.getCmp('ITEM.input.f16')._setValue(o.f16);
										Ext.getCmp('ITEM.input.f17').setFoto(o.f17);
									}
									var tblSat=Ext.getCmp('ITEM.input.measurement');
									tblSat.resetTable();
									for(var i=0,iLen=l.length; i<iLen; i++){
										if(i!==0){
											tblSat._add();
										}
										tblSat._get('measurement',i).setQuery("SELECT measurement_id AS id,measurement_name AS text FROM inv_measurement WHERE active_flag=true AND tenant_id="+_tenant_id+" AND measurement_type='"+o.f22+"' ORDER BY measurement_name ASC",l[i].f1);
										if(l[i].f2=='1'){
											tblSat._get('small_flag',i).setValue(true);
										}
										if(l[i].f3=='1'){
											tblSat._get('buy_flag',i).setValue(true);
										}
										if(l[i].f4=='1'){
											tblSat._get('storage_flag',i).setValue(true);
										}
										if(l[i].f5=='1'){
											tblSat._get('sell_flag',i).setValue(true);
										}
										tblSat._get('fraction',i)._setValue(l[i].f6);
									}
									Ext.getCmp('ITEM.input.i').setValue(a.i);
									Ext.getCmp('ITEM.input.p').setValue('UPDATE');
									
									Ext.getCmp('ITEM.input.f2').focus();
									Ext.getCmp('ITEM.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('ITEM.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('ITEM.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('ITEM.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Barang</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'ITEM.config',
					menuCode:'ITEM',
					code:[
						iif(_access('ITEM_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('ITEM_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'ITEM.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('ITEM.input.panel').qReset();
						Ext.getCmp('ITEM.input.f17').setNull();
						Ext.getCmp('ITEM.input.f4').setReadOnly(false);
						Ext.getCmp('ITEM.input.measurement').resetTable();
						Ext.getCmp('ITEM.input.f10').setReadOnly(true);
						Ext.getCmp('ITEM.input.f12').setReadOnly(true);
						Ext.getCmp('ITEM.input.f13').setReadOnly(true);
						Ext.getCmp('ITEM.input.f14').setReadOnly(true);
						Ext.getCmp('ITEM.input.f15').setReadOnly(true);
						Ext.getCmp('ITEM.input.f16').setReadOnly(true);
						Ext.getCmp('ITEM.input.f19').setReadOnly(true);
						Ext.getCmp('ITEM.input.f20').setReadOnly(true);
						Ext.getCmp('ITEM.input.f21').setReadOnly(true);
						Ext.getCmp('ITEM.input.f23').setReadOnly(true);
						Ext.getCmp('ITEM.input.f24').setReadOnly(true);
						Ext.getCmp('ITEM.input.f18').setReadOnly(true);
						Ext.getCmp('ITEM.input.f17').input=false;
						
						Ext.getCmp('ITEM.input.f4').enable();
						Ext.getCmp('ITEM.input.p').setValue('ADD');
						Ext.getCmp('ITEM.list').hide();
						Ext.getCmp('ITEM.input').show();
						if(getSetting('ITEM','SEQUENCE')=='Y'){
							Ext.getCmp('ITEM.input.f1').setReadOnly(true);
							Ext.getCmp('ITEM.input.f2').focus();
						}else{
							Ext.getCmp('ITEM.input.f1').setReadOnly(false);
							Ext.getCmp('ITEM.input.f1').focus();
						}
						Ext.getCmp('ITEM.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'ITEM.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'ITEM.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Barang'},
								{id:'f1',text:'Kode Barang'},
								{id:'f6',text:'Barcode'},
								{id:'f7',text:'ID Produk'},
								{id:'f8',text:'Kode Produk'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('ITEM.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'ITEM.text',
							press:{
								enter:function(){
									_click('ITEM.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'ITEM.btnSearch',
							handler : function(a) {
								Ext.getCmp('ITEM.list').refresh(false);
							}
						},{
							tooltip:'Export',
							iconCls: 'fa fa-file-excel-o',
							tooltip:'Export To Excel',
							id:'ITEM.btnExport',
							handler:function(a){
								Ext.getCmp('ITEM.confirm').confirm({
									msg : "Apakah Akan Export Data ?",
									allow : 'ITEM.export',
									onY : function() {
										window.open(url+'cmd?m=ITEM&f=toExcel&session='+_session_id+'&'+Ext.getCmp('ITEM.dropdown').getValue()+'='+Ext.getCmp('ITEM.text').getValue());
									}
								})
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'ITEM.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('ITEM.search').show();
						Ext.getCmp('ITEM.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Barang',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Barang',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',minWidth:250,dataIndex: 'f3' },
				{ text: 'Jenis Barang',width: 200,dataIndex: 'f4' },
				{ xtype:'active',dataIndex: 'f5'},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ITEM.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('ITEM.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'ITEM.input',
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
									_click('ITEM.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ITEM.input.btnClose');
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
					text:'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'ITEM.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('ITEM.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('ITEM.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'ITEM.close',
								onY : function() {
									Ext.getCmp('ITEM.input').hide();
									Ext.getCmp('ITEM.list').show();
								}
							});
						}else{
							Ext.getCmp('ITEM.input').hide();
							Ext.getCmp('ITEM.list').show();
						}
					}
				},'->','<b>Input Item/Barang</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'ITEM.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('ITEM.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('ITEM.confirm').confirm({
								msg : 'Apakah akan Simpan data ini?',
								allow : 'ITEM.save',
								onY : function() {
									var param = Ext.getCmp('ITEM.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=ITEM&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('ITEM.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('ITEM.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('ITEM.input').hide();
												Ext.getCmp('ITEM.list').show();
												Ext.getCmp('ITEM.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('ITEM.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('ITEM.input').hide();
							Ext.getCmp('ITEM.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					submit:'ITEM.input.btnSave',
					id : 'ITEM.input.panel',
					layout:'column',
					items:[
						{
							xtype:'form',
							columnWidth: .5,
							cls:'i-transparent',
							border:false,
							minWidth: 350,
							maxWidth: 400,
							items:[
								{
									xtype:'form',
									cls:'i-transparent',
									border:false,
									items:[
										{
											xtype:'ihiddenfield',
											name:'p',
											id:'ITEM.input.p'
										},{
											xtype:'ihiddenfield',
											name:'i',
											id:'ITEM.input.i'
										},{
											xtype:'itextfield',
											maxLength:32,
											submit:'ITEM.input.panel',
											fieldLabel:'Kode Barang',
											name:'f1',
											width: 250,
											readOnly:true,
											property:{
												upper:true,
												space:false
											},
											id:'ITEM.input.f1',
											allowBlank: false
										},{
											xtype:'itextfield',
											name:'f2',
											maxLength:64,
											submit:'ITEM.input.panel',
											fieldLabel:'Nama Barang',
											property:{
												dynamic:true
											},
											id:'ITEM.input.f2',
											result:'dynamic',
											allowBlank: false
										},{
											xtype:'itextarea',
											name:'f3',
											submit:'ITEM.input.panel',
											fieldLabel:'Deskripsi',
											id:'ITEM.input.f3',
											maxLength:256,
										}, {
											xtype:'iparameter',
											id : 'ITEM.input.f4',
											submit:'ITEM.input.panel',
											parameter:'ITEM_TYPE',
											name : 'f4',
											allowBlank: false,
											fieldLabel: 'Jenis Barang',
											listeners:{
												change:function(a){
													if(a.getValue()=='ITEMTYPE_JASA'){
														Ext.getCmp('ITEM.input.f10').setReadOnly(true);
														Ext.getCmp('ITEM.input.f12').setReadOnly(true);
														Ext.getCmp('ITEM.input.f13').setReadOnly(true);
														Ext.getCmp('ITEM.input.f14').setReadOnly(true);
														Ext.getCmp('ITEM.input.f15').setReadOnly(true);
														Ext.getCmp('ITEM.input.f19').setReadOnly(true);
														Ext.getCmp('ITEM.input.f20').setReadOnly(true);
														Ext.getCmp('ITEM.input.f21').setReadOnly(true);
														Ext.getCmp('ITEM.input.f23').setReadOnly(true);
														Ext.getCmp('ITEM.input.f24').setReadOnly(true);
														Ext.getCmp('ITEM.input.f16').setReadOnly(true);
														Ext.getCmp('ITEM.input.f18').setReadOnly(true);
														Ext.getCmp('ITEM.input.f17').input=false;
													}else{
														Ext.getCmp('ITEM.input.f10').setReadOnly(false);
														Ext.getCmp('ITEM.input.f11').setReadOnly(true);
														Ext.getCmp('ITEM.input.f12').setReadOnly(false);
														Ext.getCmp('ITEM.input.f13').setReadOnly(false);
														Ext.getCmp('ITEM.input.f14').setReadOnly(false);
														Ext.getCmp('ITEM.input.f15').setReadOnly(false);
														Ext.getCmp('ITEM.input.f19').setReadOnly(false);
														Ext.getCmp('ITEM.input.f20').setReadOnly(false);
														Ext.getCmp('ITEM.input.f23').setReadOnly(false);
														Ext.getCmp('ITEM.input.f24').setReadOnly(false);
														Ext.getCmp('ITEM.input.f21').setReadOnly(false);
														Ext.getCmp('ITEM.input.f16').setReadOnly(true);
														Ext.getCmp('ITEM.input.f18').setReadOnly(false);
														Ext.getCmp('ITEM.input.f17').input=true;
													}
												}
											}
										},{
											xtype:'iparameter',
											id : 'ITEM.input.f22',
											submit:'ITEM.input.panel',
											parameter:'MEASUREMENT_TYPE',
											name : 'f22',
											allowBlank: false,
											fieldLabel: 'Jenis Satuan',
											listeners:{
												change:function(a){
													var tblSat=Ext.getCmp('ITEM.input.measurement');
													for(var i=0,iLen=tblSat._getTotal(); i<iLen; i++){
														tblSat._get('measurement',i).setValue(null);
														tblSat._get('measurement',i).setQuery("SELECT measurement_id AS id,measurement_name AS text FROM inv_measurement WHERE active_flag=true AND tenant_id="+_tenant_id+" AND measurement_type='"+a.getValue()+"' ORDER BY measurement_name ASC");
													}
												}
											}
										},{
											xtype:'icheckbox',
											name:'f5',
											submit:'ITEM.input.panel',
											fieldLabel:'Aktif',
											id:'ITEM.input.f5',
											checked:true
										},{
											xtype:'ilistinput',
											id:'ITEM.input.measurement',
											height:200,
											name:'options',
											onAdd:function(a){
												if(a._getTotal != undefined){
													var tot=a._getTotal();
													if(tot>1){
														a._get('small_flag',(tot-1)).setValue(false);
														a._get('buy_flag',(tot-1)).setValue(false);
														a._get('sell_flag',(tot-1)).setValue(false);
														a._get('storage_flag',(tot-1)).setValue(false);
														a._get('fraction',(tot-1)).setReadOnly(false);
													}
													var mea_type=Ext.getCmp('ITEM.input.f22').getValue();
													if(mea_type != null && mea_type !=''){
														for(var i=0,iLen=a._getTotal(); i<iLen; i++){
															var mea_id=a._get('measurement',i).getValue();
															a._get('measurement',i).setQuery("SELECT measurement_id AS id,measurement_name AS text FROM inv_measurement WHERE active_flag=true AND tenant_id="+_tenant_id+" AND measurement_type='"+mea_type+"' ORDER BY measurement_name ASC",mea_id);
														}
													}
												}
											},
											onBeforeRemove:function(a,l){
												if(a._getTotal != undefined){
													var tot=a._getTotal();
													if(tot>1){
														if(l==0){
															if(a._get('small_flag',l).getValue()==true){
																a._get('small_flag',l+1).setValue(true)
															}
															if(a._get('buy_flag',l).getValue()==true){
																a._get('buy_flag',l+1).setValue(true)
															}
															if(a._get('sell_flag',l).getValue()==true){
																a._get('sell_flag',l+1).setValue(true)
															}
															if(a._get('storage_flag',l).getValue()==true){
																a._get('storage_flag',l+1).setValue(true)
															}
														}else{
															if(a._get('small_flag',l).getValue()==true){
																a._get('small_flag',l-1).setValue(true)
															}
															if(a._get('buy_flag',l).getValue()==true){
																a._get('buy_flag',l-1).setValue(true)
															}
															if(a._get('sell_flag',l).getValue()==true){
																a._get('sell_flag',l-1).setValue(true)
															}
															if(a._get('storage_flag',l).getValue()==true){
																a._get('storage_flag',l-1).setValue(true)
															}
														}
													}
												}
											},
											items:[
												{
													xtype:'icomboquery',
													name:'measurement',
													submit:'ITEM.input.panel',
													text:'Satuan',
													emptyText:'Satuan',
													allowBlank: false,
													width: 100,
													query:"SELECT measurement_id AS id,measurement_name AS text FROM inv_measurement WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY measurement_name ASC"
												},{
													xtype:'iradio',
													submit:'ITEM.input.panel',
													name:'small_flag',
													width: 30,
													listeners:{
														change:function(a){
															var pnl=Ext.getCmp('ITEM.input.measurement');
															if(a.getValue()==true){
																var cmpFrac=pnl._get('fraction',a.line);
																cmpFrac.setReadOnly(true);
																cmpFrac._setValue(1);
															}else{
																var cmpFrac=pnl._get('fraction',a.line);
																cmpFrac.setReadOnly(false);
															}
															if(a.getValue()==true){
																for(var i=0,iLen=pnl._getTotal(); i<iLen;i++){
																	if(i!==a.line){
																		pnl._get('small_flag',i).setValue(false);
																	}
																}
															}
														}
													},
													align:'center',
													checked:true,
													margin:false,
													text:'Kecil'
												},{
													xtype:'iradio',
													submit:'ITEM.input.panel',
													name:'buy_flag',
													width: 30,
													align:'center',
													checked:true,
													margin:false,
													text:'Beli',
													listeners:{
														change:function(a){
															var pnl=Ext.getCmp('ITEM.input.measurement');
															if(a.getValue()==true){
																for(var i=0,iLen=pnl._getTotal(); i<iLen;i++){
																	if(i!==a.line){
																		pnl._get('buy_flag',i).setValue(false);
																	}
																}
															}
														}
													},
												},{
													xtype:'iradio',
													name:'storage_flag',
													width: 40,
													align:'center',
													value:true,
													submit:'ITEM.input.panel',
													checked:true,
													margin:false,
													text:'Simpan',
													listeners:{
														change:function(a){
															var pnl=Ext.getCmp('ITEM.input.measurement');
															if(a.getValue()==true){
																for(var i=0,iLen=pnl._getTotal(); i<iLen;i++){
																	if(i!==a.line){
																		pnl._get('storage_flag',i).setValue(false);
																	}
																}
															}
														}
													},
												},{
													xtype:'iradio',
													name:'sell_flag',
													width: 30,
													align:'center',
													submit:'ITEM.input.panel',
													checked:true,
													margin:false,
													text:'Jual',
													listeners:{
														change:function(a){
															var pnl=Ext.getCmp('ITEM.input.measurement');
															if(a.getValue()==true){
																for(var i=0,iLen=pnl._getTotal(); i<iLen;i++){
																	if(i!==a.line){
																		pnl._get('sell_flag',i).setValue(false);
																	}
																}
															}
														}
													},
												},{
													xtype:'inumberfield',
													name:'fraction',
													text:'Frac',
													submit:'ITEM.input.panel',
													allowBlank: false,
													emptyText:'Frac',
													minValue:10,
													app:{decimal:0},
													value:1,
													readOnly:true,
													width: 40,
													margin:false,
												}
											]
										}
									]
								}
							]
						},{
							xtype:'form',
							columnWidth: .5,
							cls:'i-transparent',
							border:false,
							id : 'ITEM.input.panel2',
							minWidth: 350,
							maxWidth: 400,
							items:[
								{
									xtype:'iinput',
									label : 'Expired',
									items : [
										{
											xtype:'icheckbox',
											name:'f10',
											submit:'ITEM.input.panel',
											margin:false,
											listeners:{
												change:function(a){
													if(a.getValue()==true){
														Ext.getCmp('ITEM.input.f11').setReadOnly(false);
														Ext.getCmp('ITEM.input.f11').setValue('');
														Ext.getCmp('ITEM.input.f11').focus();
													}else{
														Ext.getCmp('ITEM.input.f11').setReadOnly(true);
														Ext.getCmp('ITEM.input.f11').setValue('');
													}
												}
											},
											id:'ITEM.input.f10'
										},{
											xtype:'displayfield',
											value:'&nbsp; Pemberitahuan&nbsp;',
											margin:false,
										},{
											xtype:'inumberfield',
											name:'f11',
											submit:'ITEM.input.panel',
											width: 50,
											margin:false,
											app:{
												decimal:0
											},
											id:'ITEM.input.f11',
											readOnly:true,
											allowBlank: false
										},{
											xtype:'displayfield',
											value:'&nbsp;Hari.',
											margin:false,
										},
									]
								},{
									xtype:'iparameter',
									id : 'ITEM.input.f12',
									parameter:'ITEM_FORM',
									submit:'ITEM.input.panel',
									name : 'f12',
									allowBlank: false,
									fieldLabel: 'Bentuk Barang',
								},{
									xtype:'itextarea',
									name:'f23',
									submit:'ITEM.input.panel',
									fieldLabel:'Dimensi',
									id:'ITEM.input.f23',
									maxLength:256,
								},{
									xtype:'icomboquery',
									id : 'ITEM.input.f13',
									submit:'ITEM.input.panel',
									name : 'f13',
									allowBlank: false,
									fieldLabel: 'Pabrik',
									query:"SELECT factory_id AS id,factory_name AS text FROM inv_factory WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY factory_code ASC",
								},{
									xtype:'icomboquery',
									id : 'ITEM.input.f14',
									submit:'ITEM.input.panel',
									name : 'f14',
									allowBlank: false,
									fieldLabel: 'Kategori',
									query:"SELECT category_id AS id,category_name AS text FROM inv_category WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY category_code ASC",
								},{
									xtype:'itextfield',
									name:'f15',
									submit:'ITEM.input.panel',
									fieldLabel:'No. Izin',
									id:'ITEM.input.f15',
									allowBlank: false
								},{
									xtype:'iinput',
									anchor:'100%',
									label : 'ID Produk',
									tooltip:'ID Produk Umum Sesuai Peraturan',
									items : [
										{
											xtype:'itextfield',
											columnWidth:1,
											name:'f20',
											submit:'ITEM.input.panel',
											emptyText:'ID Produk',
											id:'ITEM.input.f20',
											margin:false,
										}
									]
								},{
									xtype:'iinput',
									anchor:'100%',
									label : 'Kode Produk',
									tooltip:'Kode Produk Umum Sesuai Peraturan',
									items : [
										{
											xtype:'itextfield',
											columnWidth:1,
											name:'f21',
											submit:'ITEM.input.panel',
											emptyText:'Kode Produk',
											id:'ITEM.input.f21',
											margin:false,
										}
									]
								},{
									xtype:'iinput',
									anchor:'100%',
									label : 'Barcode',
									tooltip:'Barcode Satuan Jual',
									items : [
										{
											xtype:'itextfield',
											columnWidth:1,
											submit:'ITEM.input.panel',
											emptyText:'Barcode',
											name:'f19',
											id:'ITEM.input.f19',
											margin:false,
										}
									]
								},{
									xtype:'icheckbox',
									name:'f24',
									fieldLabel:'Multi Gin',
									value:true,
									submit:'ITEM.input.panel',
									id:'ITEM.input.f24'
								},{
									xtype:'iinput',
									label : 'Stok',
									tooltip:'Bedasarkan Satuan Jual',
									items : [
										{
											xtype:'icheckbox',
											name:'f18',
											submit:'ITEM.input.panel',
											margin:false,
											listeners:{
												change:function(a){
													if(a.getValue()==true){
														Ext.getCmp('ITEM.input.f16').setReadOnly(false);
														Ext.getCmp('ITEM.input.f16').setValue('');
														Ext.getCmp('ITEM.input.f16').focus();
													}else{
														Ext.getCmp('ITEM.input.f16').setReadOnly(true);
														Ext.getCmp('ITEM.input.f16').setValue('');
													}
												}
											},
											id:'ITEM.input.f18'
										},{
											xtype:'displayfield',
											value:'&nbsp; Pemberitahuan&nbsp;',
											margin:false,
										},{
											xtype:'inumberfield',
											name:'f16',
											width: 50,
											submit:'ITEM.input.panel',
											readOnly:true,
											margin:false,
											id:'ITEM.input.f16',
											allowBlank: false
										}
									]
								},{
									xtype:'iinput',
									label:'Gambar',
									items:[
										{
											xtype:'ifotoupload',
											name: 'f17',
											id:'ITEM.input.f17'
										}
									]
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('ITEM.input.panel').qGetForm() == false)
					Ext.getCmp('ITEM.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah di ubah?',
						allow : 'ITEM.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'ITEM.confirm'}
	]
});