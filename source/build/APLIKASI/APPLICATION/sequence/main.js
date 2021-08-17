/*
	import cmp.ipanel
	import cmp.inumberfield
	import cmp.itable
	import cmp.icombobox
	import cmp.iconfig
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('SEQUENCE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('SEQUENCE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('SEQUENCE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('SEQUENCE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'SEQUENCE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'SEQUENCE.search',
			modal:false,
			title:'Nomor Urut - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('SEQUENCE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('SEQUENCE.search.f1').focus();
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
					id:'SEQUENCE.search.btnSearch',
					handler: function() {
						Ext.getCmp('SEQUENCE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'SEQUENCE.search.btnReset',
					handler: function() {
						Ext.getCmp('SEQUENCE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('SEQUENCE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'SEQUENCE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Urut',
							press:{
								enter:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							},
							id:'SEQUENCE.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Urut',
							press:{
								enter:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'REPEAT_TYPE',
							name : 'f3',
							press:{
								enter:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							},
							fieldLabel: 'Pengulangan'
						},{
							xtype:'itextfield',
							name:'f4',
							fieldLabel:'Format',
							press:{
								enter:function(){
									_click('SEQUENCE.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'SEQUENCE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('SEQUENCE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('SEQUENCE.dropdown').getValue()]=Ext.getCmp('SEQUENCE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=SEQUENCE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('SEQUENCE_DELETE',function(){
						Ext.getCmp('SEQUENCE.confirm').confirm({
							msg : "Apakah Akan Menghapus Data Kode Urut '"+a.f1+"' ?",
							allow : 'SEQUENCE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=SEQUENCE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('SEQUENCE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('SEQUENCE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('SEQUENCE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('SEQUENCE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('SEQUENCE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=SEQUENCE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('SEQUENCE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('SEQUENCE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('SEQUENCE.input.panel').qReset();
									Ext.getCmp('SEQUENCE.input.f1').setReadOnly(true);
									Ext.getCmp('SEQUENCE.input.f1').setValue(a.f1);
									Ext.getCmp('SEQUENCE.input.f2').setValue(o.f2);
									Ext.getCmp('SEQUENCE.input.f3')._setValue(o.f3);
									Ext.getCmp('SEQUENCE.input.f4')._setValue(o.f4);
									Ext.getCmp('SEQUENCE.input.f5').setValue(o.f5);
									Ext.getCmp('SEQUENCE.input.f6').setValue(o.f6);
									Ext.getCmp('SEQUENCE.input.i').setValue(a.i);
									Ext.getCmp('SEQUENCE.input.p').setValue('UPDATE');
									// Ext.getCmp('SEQUENCE.input').setTitle('Nomor Urut - Edit');
									Ext.getCmp('SEQUENCE.list').hide();
									Ext.getCmp('SEQUENCE.input').show();
									Ext.getCmp('SEQUENCE.input.f2').focus();
									Ext.getCmp('SEQUENCE.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('SEQUENCE.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('SEQUENCE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('SEQUENCE.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Nomor Urut</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'SEQUENCE.config',
					menuCode:'SEQUENCE',
					code:[
						iif(_access('SEQUENCE_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('SEQUENCE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
						iif(_access('SEQUENCE_config_FORMAT')==false,'FORMAT',null),
						iif(_access('SEQUENCE_config_DIGIT')==false,'DIGIT',null),
						iif(_access('SEQUENCE_config_VALUE')==false,'VALUE',null),
						iif(_access('SEQUENCE_config_REPEAT')==false,'REPEAT',null)
					]
				},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'SEQUENCE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('SEQUENCE.input.panel').qReset();
						Ext.getCmp('SEQUENCE.input.p').setValue('ADD');
						Ext.getCmp('SEQUENCE.list').hide();
						Ext.getCmp('SEQUENCE.input').show();
						if(getSetting('SEQUENCE','SEQUENCE')=='Y'){
							Ext.getCmp('SEQUENCE.input.f1').setReadOnly(true);
							Ext.getCmp('SEQUENCE.input.f2').focus();
						}else{
							Ext.getCmp('SEQUENCE.input.f1').setReadOnly(false);
							Ext.getCmp('SEQUENCE.input.f1').focus();
						}
						Ext.getCmp('SEQUENCE.input.f5').setValue(getSetting('SEQUENCE','FORMAT'));
						Ext.getCmp('SEQUENCE.input.f3').setValue(getSetting('SEQUENCE','DIGIT'));
						Ext.getCmp('SEQUENCE.input.f4').setValue(getSetting('SEQUENCE','VALUE'));
						Ext.getCmp('SEQUENCE.input.f6').setValue(getSetting('SEQUENCE','REPEAT'));
						Ext.getCmp('SEQUENCE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'SEQUENCE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'SEQUENCE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Urut'},
								{id:'f1',text:'Kode Urut'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('SEQUENCE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'SEQUENCE.text',
							press:{
								enter:function(){
									_click('SEQUENCE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'SEQUENCE.btnSearch',
							handler : function(a) {
								Ext.getCmp('SEQUENCE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'SEQUENCE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('SEQUENCE.search').show();
						Ext.getCmp('SEQUENCE.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Nomor Urut',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Nomor Urut',width: 200,dataIndex: 'f2'},
				{ text: 'N Akhir',width: 60,dataIndex: 'f3' },
				{ text: 'Pengulangan',width: 100,dataIndex: 'f4' },
				{ text: 'Terakhir',width: 100,dataIndex: 'f6',xtype:'date' },
				{ text: 'Format',flex:1,sortable:false,minWidth: 200,dataIndex: 'f5' },
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('SEQUENCE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('SEQUENCE.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'SEQUENCE.input',
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
									_click('SEQUENCE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('SEQUENCE.input.btnClose');
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
					id:'SEQUENCE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('SEQUENCE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('SEQUENCE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'SEQUENCE.close',
								onY : function() {
									Ext.getCmp('SEQUENCE.input').hide();
									Ext.getCmp('SEQUENCE.list').show();
								}
							});
						}else{
							Ext.getCmp('SEQUENCE.input').hide();
							Ext.getCmp('SEQUENCE.list').show();
						}
					}
				},'->','<b>Input Nomor Urut</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'SEQUENCE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('SEQUENCE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('SEQUENCE.confirm').confirm({
								msg : 'Apakah Akan Menyimpan Data Ini ?',
								allow : 'SEQUENCE.save',
								onY : function() {
									var param = Ext.getCmp('SEQUENCE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=SEQUENCE&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('SEQUENCE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('SEQUENCE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('SEQUENCE.input').hide();
												Ext.getCmp('SEQUENCE.list').show();
												Ext.getCmp('SEQUENCE.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('SEQUENCE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('SEQUENCE.input.p').getValue()=='ADD'){
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
					id : 'SEQUENCE.input.panel',
					submit:'SEQUENCE.input.btnSave',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'SEQUENCE.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'SEQUENCE.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							submit:'SEQUENCE.input.panel',
							fieldLabel:'Kode Urut',
							note:'Jika Mode Tambah, dan Kode Urut Tidak dapat di input,\nMaka Urut Setting Aktif.',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'SEQUENCE.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							submit:'SEQUENCE.input.panel',
							fieldLabel:'Nama Urut',
							property:{
								dynamic:true
							},
							id:'SEQUENCE.input.f2',
							result:'dynamic',
							allowBlank: false
						},{
							xtype:'inumberfield',
							name:'f3',
							fieldLabel:'Digit',
							submit:'SEQUENCE.input.panel',
							note:'Digit Penomoran, Contoh 6 Digit Hasilnya : 000001.',
							app:{
								decimal:0
							},
							width: 150,
							id:'SEQUENCE.input.f3',
							allowBlank: false
						},{
							xtype:'inumberfield',
							name:'f4',
							submit:'SEQUENCE.input.panel',
							app:{
								decimal:0
							},
							fieldLabel:'Nilai Terakhir',
							width: 170,
							note:'Nomor Counter Terakhir Berjalan.',
							id:'SEQUENCE.input.f4',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f5',
							submit:'SEQUENCE.input.panel',
							note:'Keterangan :\n'+
							'(d): Tanggal.\n'+
							'(dr): Tanggal Romawi.\n'+
							'(D): Hari.\n'+
							'(Dr): Hari Romawi.\n'+
							'(m): Bulan Angka Contoh Januari Hasilnya 01.\n'+
							'(mr): Bulan Angka Romawi.\n'+
							'(M): Nama Bulan.\n'+
							'(y): Tahun Kecil Contoh 1994 Hasilnya 94.\n'+
							'(yr): Tahun Kecil Romawi.\n'+
							'(Y): Tahun Besar Contoh 1994.\n'+
							'(Yr): Tahun Besar Romawi.\n'+
							'(N*): Nomot digit, Contoh Untuk 6 Digit adalah (N0)(N1)(N2)(N3)(N4)(N5).\n'
							,
							fieldLabel:'Format',
							id:'SEQUENCE.input.f5',
							allowBlank: false
						},{
							xtype:'iparameter',
							submit:'SEQUENCE.input.panel',
							id : 'SEQUENCE.input.f6',
							fieldLabel:'Pengulangan',
							name : 'f6',
							note:'Pengulangan Nomor Urut,\n Contoh Bulanan maka Nilai Terkahir akan kembali menjadi 0 Jika Bulan Baru',
							parameter:'REPEAT_TYPE',
							allowBlank : false
						}
					]
				}
			],
		},{xtype:'iconfirm',id : 'SEQUENCE.confirm'}
	]
});