/*
	import cmp.ipanel
	import cmp.iinput
	import cmp.idatefield
	import cmp.iselect
	import cmp.icomboquery
	import cmp.ilistinput
	import cmp.icombobox
	import cmp.iconfig
	import cmp.itable
	import cmp.inumberfield
	import PARAMETER.iparameter
	import INV_UNIT.iunit
*/
new Ext.Panel({
	id : 'INV_DIST_UNIT.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_DIST_UNIT.search',
			modal:false,
			title:'Distribusi - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_DIST_UNIT.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_DIST_UNIT.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_DIST_UNIT.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_DIST_UNIT.search.f1').focus();
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
					id:'INV_DIST_UNIT.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_DIST_UNIT.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_DIST_UNIT.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_DIST_UNIT.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close fa-red',
					handler: function() {
						Ext.getCmp('INV_DIST_UNIT.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_DIST_UNIT.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Distribusi',
							press:{
								enter:function(){
									_click('INV_DIST_UNIT.search.btnSearch');
								}
							},
							id:'INV_DIST_UNIT.search.f1'
						},{
							xtype:'iinput',
							label : 'Tgl. Distribusi',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('INV_DIST_UNIT.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									name : 'f3',
									press:{
										enter:function(){
											_click('INV_DIST_UNIT.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iunit',
							name:'f6',
							fieldLabel:'Unit Tujuan',
							press:{
								enter:function(){
									_click('INV_DIST_UNIT.search.btnSearch');
								}
							},
							id:'INV_DIST_UNIT.search.f6'
						},{ 
							xtype:'iparameter',
							id : 'INV_DIST_UNIT.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_DIST_UNIT.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_DIST_UNIT.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('INV_DIST_UNIT.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('INV_DIST_UNIT.dropdown').getValue()]=Ext.getCmp('INV_DIST_UNIT.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_DIST_UNIT&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_DIST_UNIT_DELETE',function(){
						Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
							msg : "Apakah akan menghapus No. Terima '"+a.f1+"'",
							allow : 'INV_DIST_UNIT.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_DIST_UNIT&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_DIST_UNIT.list').setLoading('Hapus Kode Terima '+a.f1);
									},
									success : function(response) {
										Ext.getCmp('INV_DIST_UNIT.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_DIST_UNIT.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_DIST_UNIT.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_DIST_UNIT_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_DIST_UNIT&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_DIST_UNIT.list').setLoading("Mengambil No. Terima '"+a.f1+"'");
							},
							success : function(response) {
								Ext.getCmp('INV_DIST_UNIT.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
									Ext.getCmp('INV_DIST_UNIT.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.receive_detail_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('sat',i).setUrl(url + 'cmd?m=INV_DIST_UNIT&f=loadMeasurementByUpdate&i='+obj.item_id+'&frac='+obj.fraction+'&mou='+obj.measurement_id,obj.measurement_id);

										table._get('qty',i)._setValue(obj.qty);
										table._get('fraction',i)._setValue(obj.fraction);
										table._get('sat_kecil',i).setValue(obj.measurement_name);
										table._get('harga_beli',i)._setValue(obj.buy_price);
										table._get('discount',i)._setValue(obj.disc);
										table._get('discount_rp',i)._setValue(obj.disc_price);
										table._get('ppn',i)._setValue(obj.ppn);
										table._get('gin',i).setValue(obj.gin_code);
										if(obj.expire_flag==1){
											table._get('expired',i).setReadOnly(false);
											table._get('expired',i).setValue(obj.expire_date);
										}else{
											table._get('expired',i).setReadOnly(true);
										}
										table._get('expire_flag',i).setValue(obj.expire_flag);
										table._get('batch',i).setValue(obj.batch);
										table.countLine(i);
										
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('barcode',i).setReadOnly(true);
											table._get('sat',i).setReadOnly(true);
											table._get('expired',i).setReadOnly(true);
											table._get('batch',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('fraction',i).setReadOnly(true);
											table._get('del',i).disable();
											if(obj.qty_out<0){
												table._get('ppn',i).setReadOnly(true);
												table._get('discount',i).setReadOnly(true);
												table._get('discount_rp',i).setReadOnly(true);
												table._get('harga_beli',i).setReadOnly(true);
											}
										}
									}
									table.loadQuery=true;
									Ext.getCmp('INV_DIST_UNIT.input.i').setValue(a.i);
									Ext.getCmp('INV_DIST_UNIT.input.f1').setValue(a.f1);
									Ext.getCmp('INV_DIST_UNIT.input.f2').setValue(a.f2);
									Ext.getCmp('INV_DIST_UNIT.input.f4').setValue({i:o.distributor_id,name:o.vendor});
									Ext.getCmp('INV_DIST_UNIT.input.f6').setValue(o.description);
									if(o.posted ==0){
										Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(false);
										Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(false);
										Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(false);
										Ext.getCmp('INV_DIST_UNIT.input.btnPosting').enable();
										Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').disable();
									}else{
										table._getAddButton().disable();
										Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(true);
										Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(true);
										Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(true);
										Ext.getCmp('INV_DIST_UNIT.input.btnPosting').disable();
										Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').enable();
									}
									table.count();
									Ext.getCmp('INV_DIST_UNIT.list').hide();
									Ext.getCmp('INV_DIST_UNIT.input').show();
									Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
									Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_DIST_UNIT.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_DIST_UNIT.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_DIST_UNIT.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Distribusi</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'INV_DIST_UNIT.config',
					code:[
						iif(_access('INV_DIST_UNIT_config_UNIT_ID')==false,'UNIT_ID',null),
						iif(_access('INV_DIST_UNIT_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
						iif(_access('INV_DIST_UNIT_config_SEQUENCE_GIN')==false,'SEQUENCE_GIN',null),
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'INV_DIST_UNIT.btnAdd',
					iconCls: 'fa fa-plus  fa-green',
					handler:function(a){
						Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(false);
						Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(false);
						Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(false);
						Ext.getCmp('INV_DIST_UNIT.input.panel').qReset();
						Ext.getCmp('INV_DIST_UNIT.input.tableOption').resetTable();
						Ext.getCmp('INV_DIST_UNIT.input.btnPosting').enable();
						Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').disable();
						Ext.getCmp('INV_DIST_UNIT.list').hide();
						Ext.getCmp('INV_DIST_UNIT.input').show();
						Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
						Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'INV_DIST_UNIT.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'INV_DIST_UNIT.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'No. Distribusi'},
								{id:'f2',text:'Deskripsi'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('INV_DIST_UNIT.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'INV_DIST_UNIT.text',
							press:{
								enter:function(){
									_click('INV_DIST_UNIT.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'INV_DIST_UNIT.btnSearch',
							handler : function(a) {
								Ext.getCmp('INV_DIST_UNIT.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_DIST_UNIT.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('INV_DIST_UNIT.search').show();
						Ext.getCmp('INV_DIST_UNIT.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'Nomor',width: 120, dataIndex: 'f1' },
				{ text: 'Tanggal',width: 100,xtype:'date',dataIndex: 'f2'},
				{ text: 'Unit',flex: 1,dataIndex: 'f4' },
				{ xtype:'active',text: 'Posting',dataIndex: 'f5'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_DIST_UNIT.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_DIST_UNIT.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'INV_DIST_UNIT.input',
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
									_click('INV_DIST_UNIT.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_DIST_UNIT.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_DIST_UNIT.input.btnNew');
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
					id:'INV_DIST_UNIT.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('INV_DIST_UNIT.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'INV_DIST_UNIT.close',
								onY : function() {
									Ext.getCmp('INV_DIST_UNIT.input').hide();
									Ext.getCmp('INV_DIST_UNIT.list').show();
								}
							});
						}else{
							Ext.getCmp('INV_DIST_UNIT.input').hide();
							Ext.getCmp('INV_DIST_UNIT.list').show();
						}
					}
				},'->','<b>Input Distribusi</b>','->',
				{
					xtype:'buttongroup',
					items:[
						{
							text: 'New',
							tooltip:'New <b>[F6]</b>',
							id:'INV_DIST_UNIT.input.btnNew',
							iconCls:'fa fa-file',
							handler: function() {
								var $this = this;
								$this.closing = false;
								if (Ext.getCmp('INV_DIST_UNIT.input.panel').qGetForm() == false)
									Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
										msg :'Apakah akan mengabaikan data yang sudah diubah?',
										allow : 'INV_DIST_UNIT.close',
										onY : function() {
											Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(false);
											Ext.getCmp('INV_DIST_UNIT.input.f3').setReadOnly(false);
											Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(false);
											Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(false);
											Ext.getCmp('INV_DIST_UNIT.input.panel').qReset();
											Ext.getCmp('INV_DIST_UNIT.input.tableOption').resetTable();
											Ext.getCmp('INV_DIST_UNIT.input.btnPosting').enable();
											Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').disable();
											Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
											Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
										}
									});
								else{
									Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(false);
									Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(false);
									Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(false);
									Ext.getCmp('INV_DIST_UNIT.input.panel').qReset();
									Ext.getCmp('INV_DIST_UNIT.input.tableOption').resetTable();
									Ext.getCmp('INV_DIST_UNIT.input.btnPosting').enable();
									Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').disable();
									Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
									Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
								}
								return false;
							}
						},{
							text: 'Simpan',
							tooltip:'Simpan <b>[Ctrl+s]</b>',
							id:'INV_DIST_UNIT.input.btnSave',
							iconCls:'fa fa-save fa-green',
							handler: function() {
								var req=Ext.getCmp('INV_DIST_UNIT.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(table._get('fraction',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Faction Tidak Boleh 0.',type : 'warning'});
											table._get('fraction',i).focus();
											return false;
										}
										if(objCek[table._get('barang',i).getValue()]== undefined){
											objCek[table._get('barang',i).getValue()]={};
										}
										if(objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] != undefined){
											error=true;
											Ext.create('IToast').toast({msg : 'Satuan Barang dan Batch tidak boleh sama.',type : 'warning'});
											table._get('sat',i).focus();
											return false;
										}else{
											objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] =true;
										}
										
									}
									Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
										msg : 'Apakah akan menyimpan data ini?',
										allow : 'INV_DIST_UNIT.save',
										onY : function() {
											var param = Ext.getCmp('INV_DIST_UNIT.input.panel').qParams();
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_DIST_UNIT&f=save',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('INV_DIST_UNIT.input').setLoading('Menyimpan');
												},
												success : function(response) {
													Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
													var r = ajaxSuccess(response);
													if (r.r == 'S') {
														for(var j=0,jLen=r.d.l.length; j<jLen;j++){
															var Oj=r.d.l[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('id',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														Ext.getCmp('INV_DIST_UNIT.input.i').setValue(r.d.id);
														Ext.getCmp('INV_DIST_UNIT.input.f1').setValue(r.d.code);
														Ext.getCmp('INV_DIST_UNIT.list').refresh();
														Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
														Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true)
									Ext.getCmp('INV_DIST_UNIT.input').qClose();
							}
						},{
							text: 'Posting',
							tooltip:'Posting',
							id:'INV_DIST_UNIT.input.btnPosting',
							iconCls:'fa fa-check fa-green',
							handler: function() {
								if(Ext.getCmp('INV_DIST_UNIT.input.c').getValue()==''){
									Ext.getCmp('INV_DIST_UNIT.input.c').setValue('Y');
								}else{
									Ext.getCmp('INV_DIST_UNIT.input.c').setValue('');
								}
								var req=Ext.getCmp('INV_DIST_UNIT.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(table._get('fraction',i)._getValue()==0){
											Ext.create('IToast').toast({msg : 'Faction Tidak Boleh 0.',type : 'warning'});
											table._get('fraction',i).focus();
											return false;
										}
										if(objCek[table._get('barang',i).getValue()]== undefined){
											objCek[table._get('barang',i).getValue()]={};
										}
										if(objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] != undefined){
											error=true;
											Ext.create('IToast').toast({msg : 'Satuan Barang dan Batch tidak boleh sama.',type : 'warning'});
											table._get('sat',i).focus();
											return false;
										}else{
											objCek[table._get('barang',i).getValue()][table._get('sat',i).getValue()+"_"+table._get('batch',i).getValue()] =true;
										}
									}
									Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
										msg : 'Apakah akan di Posting?',
										allow : 'INV_DIST_UNIT.posting',
										onY : function() {
											var param = Ext.getCmp('INV_DIST_UNIT.input.panel').qParams();
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_DIST_UNIT&f=posting',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('INV_DIST_UNIT.input').setLoading('Menyimpan');
												},
												success : function(response) {
													Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
													var r = ajaxSuccess(response);
													if (r.r == 'S') {
														for(var j=0,jLen=r.d.l.length; j<jLen;j++){
															var Oj=r.d.l[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('id',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														for(var j=0,jLen=r.d.lg.length; j<jLen;j++){
															var Oj=r.d.lg[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('gin',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														Ext.getCmp('INV_DIST_UNIT.input.i').setValue(r.d.id);
														Ext.getCmp('INV_DIST_UNIT.input.f1').setValue(r.d.code);
														Ext.getCmp('INV_DIST_UNIT.list').refresh();
														Ext.getCmp('INV_DIST_UNIT.input.btnPosting').disable();
														Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').enable();
														Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
														Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
														for(var i=0,iLen=table._getTotal();i<iLen;i++){
															table._get('barang',i).setReadOnly(true);
															table._get('barcode',i).setReadOnly(true);
															table._get('sat',i).setReadOnly(true);
															table._get('expired',i).setReadOnly(true);
															table._get('batch',i).setReadOnly(true);
															table._get('qty',i).setReadOnly(true);
															table._get('fraction',i).setReadOnly(true);
															table._get('del',i).disable();
														}
														table._getAddButton().disable();
														Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(true);
														Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(true);
														Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(true);
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true)
									Ext.getCmp('INV_DIST_UNIT.input').qClose();
							}
						},{
							text: 'Unposting',
							tooltip:'Unposting <b>[Esc]</b>',
							id:'INV_DIST_UNIT.input.btnUnposting',
							iconCls:'fa fa-close fa-red',
							handler: function() {
								Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
									msg : 'Apakah akan di UnPosting?',
									allow : 'INV_DIST_UNIT.posting',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=INV_DIST_UNIT&f=unposting',
											method : 'POST',
											params:{i:Ext.getCmp('INV_DIST_UNIT.input.i').getValue()},
											before:function(){
												Ext.getCmp('INV_DIST_UNIT.input').setLoading('Menyimpan');
											},
											success : function(response) {
												Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
													Ext.getCmp('INV_DIST_UNIT.list').refresh();
													Ext.getCmp('INV_DIST_UNIT.input.btnPosting').enable();
													Ext.getCmp('INV_DIST_UNIT.input.btnUnposting').disable();
													Ext.getCmp('INV_DIST_UNIT.input.f2').focus();
													Ext.getCmp('INV_DIST_UNIT.input.panel').qSetForm();
													for(var i=0,iLen=table._getTotal();i<iLen;i++){
														table._get('barang',i).setReadOnly(false);
														table._get('sat',i).setReadOnly(false);
														if(table._get('expire_flag',i).getValue()==1){
															table._get('expired',i).setReadOnly(false);
														}
														table._get('batch',i).setReadOnly(false);
														table._get('barcode',i).setReadOnly(false);
														table._get('qty',i).setReadOnly(false);
														table._get('fraction',i).setReadOnly(false);
														table._get('del',i).enable();
														table._get('ppn',i).setReadOnly(false);
														table._get('discount',i).setReadOnly(false);
														table._get('discount_rp',i).setReadOnly(false);
														table._get('harga_beli',i).setReadOnly(false);
													}
													table._getAddButton().enable();
													Ext.getCmp('INV_DIST_UNIT.input.f2').setReadOnly(false);
													Ext.getCmp('INV_DIST_UNIT.input.f4').setReadOnly(false);
													Ext.getCmp('INV_DIST_UNIT.input.f6').setReadOnly(false);
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('INV_DIST_UNIT.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}
						}
					]
				}
				
			],
			items:[
				{
					xtype:'ipanel',
					paddingBottom:iif(_access('INV_DIST_UNIT_INPUT_COST')==true,false,true),
					id : 'INV_DIST_UNIT.input.panel',
					submit:'INV_DIST_UNIT.input.btnSave',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'form',
							border:false,
							cls:'i-transparent',
							style:'margin-bottom: 5px;',
							layout:'column',
							items:[
								{
									xtype:'ihiddenfield',
									name:'i',
									id:'INV_DIST_UNIT.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_DIST_UNIT.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_DIST_UNIT.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Distribusi'
								},{
									xtype:'idatefield',
									id : 'INV_DIST_UNIT.input.f2',
									submit:'INV_DIST_UNIT.input.panel',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Distribusi'
								},{
									xtype:'iunit',
									fieldLabel:'Unit Tujuan',
									labelAlign:'top',
									submit:'INV_DIST_UNIT.input.panel',
									width: 250,
									id:'INV_DIST_UNIT.input.f4',
									allowBlank : false,
									name:'f4'
								},{
									xtype:'itextfield',
									id : 'INV_DIST_UNIT.input.f6',
									labelAlign:'top',
									submit:'INV_DIST_UNIT.input.panel',
									maxLength:128,
									name : 'f6',
									width: 300,
									fieldLabel:'Keterangan'
								}	
							]
						},{
							xtype:'ilistinput',
							id:'INV_DIST_UNIT.input.tableOption',
							name:'options',
							flex:1,
							style:'padding: 0px 4px;',
							margin:false,
							loadQuery:true,
							
							onRemove:function(){
								var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
								table.count();
							},
							countLine:function(line){
								var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
								var jumlahQty=parseFloat(table._get('fraction',line)._getValue())* parseFloat(table._get('qty',line)._getValue());
								table._get('jumlah_qty',line)._setValue(jumlahQty);
								var discAll=0,ppn=0,tot=0;
								discAll=((((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))/100)*parseFloat(table._get('discount',line)._getValue()))+
									parseFloat(table._get('discount_rp',line)._getValue()));
								table._get('jumlah_harga',line).setValue((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue())));
								table._get('jumlah_diskon',line).setValue(discAll);
								ppn=(((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))-discAll)/100)*parseFloat(table._get('ppn',line)._getValue());
								table._get('jumlah_ppn',line).setValue(ppn);
								tot=((parseFloat(table._get('harga_beli',line)._getValue())*parseFloat(table._get('qty',line)._getValue()))-discAll)+ppn;
								table._get('jumlah',line)._setValue(tot);
								table._get('harga_dasar',line).setValue((tot/parseFloat(table._get('qty',line)._getValue()))/parseFloat(table._get('fraction',line)._getValue()));
							},
							count:function(){
								var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
								var jumlahDiskon=0,jumlahPPN=0,jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahDiskon+=parseFloat(table._get('jumlah_diskon',i).getValue());
									jumlahPPN+=parseFloat(table._get('jumlah_ppn',i).getValue());
									jumlahHarga+=parseFloat(table._get('jumlah_harga',i).getValue());
								}
								Ext.getCmp('INV_DIST_UNIT.input.sub_total')._setValue(jumlahHarga);
							},
							items:[
								{
									xtype:'itextfield',
									name:'barcode',
									submit:'INV_DIST_UNIT.input.panel',
									// hidden:iif(getSetting('INV_DIST_UNIT','BARCODE')=='Y',false,true),
									text:'Barcode (Pencarian)',
									width:150,
									emptyText:'Masukan Barcode',
									press:{
										enter:function(b){
											if(b.getValue()!==''){
												var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
												if(table.loadQuery==true){
													Ext.Ajax.request({
														url : url + 'cmd?m=INV_DIST_UNIT&f=getInitItemByBarcode',
														method : 'GET',
														params : {
															i : b.getValue()
														},
														success : function(response) {
															var r = ajaxSuccess(response);
															if (r.r == 'S'){
																var o=r.d.o;
																table._get('barang',b.line).setValue({i:o.i,name:o.item});
																table._get('sat',b.line).setUrl(url + 'cmd?m=INV_DIST_UNIT&f=loadMeasurementByItem&i='+o.i,o.f1);	
																table._get('qty',b.line)._setValue(1);
																if(o.harga==null){
																	o.harga=0;
																}
																table._get('harga_beli',b.line)._setValue(o.harga);
																table._get('fraction',b.line)._setValue(o.f2);
																table._get('sat_kecil',b.line).setValue(o.f3);
																table._get('expire_flag',b.line).setValue(o.f4);
																if(o.f4==1){
																	table._get('expired',b.line).setReadOnly(false);
																}else{
																	table._get('expired',b.line).setReadOnly(true);
																}
																table.countLine(b.line);
																table.count();
															}
														},
														failure : function(jqXHR, exception) {
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											}
										}
									}
								},{
									xtype:'iselect',
									width: 250,
									text:'Barang',
									emptyText:'Barang',
									submit:'INV_DIST_UNIT.input.panel',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onReset:function(a){
										var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
										table.countLine(a.line);
										table.count();
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
										
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_DIST_UNIT&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
														if(a.harga==null){
															a.harga=0;
														}
														table._get('harga',b.line)._setValue(a.harga);
														table._get('qty',b.line)._setValue(1);
														table._get('qty_dist',b.line)._setValue(1);
														table._get('qty_sisa',b.line)._setValue(a.stock);
														table._get('gin',b.line).setValue(a.gin);
														table._get('fraction',b.line).setValue(a.frac);
														table._get('gin_id',b.line).setValue(a.gin_id);
														table._get('sat_kecil',b.line).setValue(o.f2);
														table._get('sat_kecil_id',b.line).setValue(o.f1);
														table.countLine(b.line);
														table.count();
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									},onBeforeShow:function(){
										Ext.getCmp('INV_DIST_UNIT.input.item.unit_id').setValue(getSetting('INV_DIST_UNIT','UNIT_ID'));
									},
									button:{
										urlData : url + 'cmd?m=INV_DIST_UNIT&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'unit_id',
												id:'INV_DIST_UNIT.input.item.unit_id',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											},{
												xtype:'itextfield',
												name:'f3',
												fieldLabel:'Deskripsi',
											},{
												xtype:'itextfield',
												name:'f6',
												fieldLabel:'Gin Code',
											},{
												xtype:'itextfield',
												name:'f7',
												fieldLabel:'Bacth',
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ hidden:true,dataIndex: 'gin_id'},
											{ hidden:true,dataIndex: 'frac'},
											{ text: 'Tgl. Expire',width: 80, dataIndex: 'expire'},
											{ text: 'Tgl. Terima',width: 80, dataIndex: 'tgl'},
											{ text: 'Kode Gin',width: 100, dataIndex: 'gin'},
											{ text: 'No. Terima',width: 100, dataIndex: 'terima'},
											{ text: 'Barang',flex:1, dataIndex: 'name'},
											{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_s;
												}
											}
										]
									}
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Gin',
									readOnly:true,
									submit:'INV_DIST_UNIT.input.panel',
									tabIndex:-1,
									width:100,
									emptyText:'Gin',
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Gin Tujuan',
									readOnly:true,
									submit:'INV_DIST_UNIT.input.panel',
									tabIndex:-1,
									width:100,
									emptyText:'Gin Code',
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'idropdown',
									name:'sat',
									tabIndex:-1,
									submit:'INV_DIST_UNIT.input.panel',
									text:'Satuan',
									listeners:{
										select:function(a,b,c){
											var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
											if(table.loadQuery==true){
												table._get('fraction',a.line)._setValue(b[0].raw.f1);
												table.countLine(a.line);
												table.count();
											}
										}
									},
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'inumberfield',
									name:'qty',
									submit:'INV_DIST_UNIT.input.panel',
									align:'right',
									text:'Qty',
									allowBlank: false,
									emptyText:'Qty',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'fraction',
									text:'Frac',
									tabIndex:-1,
									submit:'INV_DIST_UNIT.input.panel',
									align:'right',
									app:{decimal:0},
									allowBlank: false,
									emptyText:'Frac',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_DIST_UNIT.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'jumlah_qty',
									text:'Jumlah',
									submit:'INV_DIST_UNIT.input.panel',
									align:'right',
									readOnly:true,
									tabIndex:-1,
									app:{decimal:0},
									emptyText:'Jumlah',
									width: 40,
								},{
									xtype:'itextfield',
									name:'sat_kecil',
									text:'Sat. Kecil',
									readOnly:true,
									submit:'INV_DIST_UNIT.input.panel',
									tabIndex:-1,
									allowBlank: false,
									width:100,
									emptyText:'Sat. Kecil',
								},{
									xtype:'ihiddenfield',
									name:'jumlah_harga',
									value:0
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_DIST_UNIT.input.panel').qGetForm() == false)
					Ext.getCmp('INV_DIST_UNIT.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_DIST_UNIT.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_DIST_UNIT.confirm'}
	]
});