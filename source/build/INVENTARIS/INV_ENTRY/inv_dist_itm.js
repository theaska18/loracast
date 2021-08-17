shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_DIST_ITM.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_DIST_ITM.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_DIST_ITM.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_DIST_ITM.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	xtype:'panel',
	id : 'INV_DIST_ITM.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_DIST_ITM.search',
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
									_click('INV_DIST_ITM.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_DIST_ITM.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_DIST_ITM.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_DIST_ITM.search.f1').focus();
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
					id:'INV_DIST_ITM.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_DIST_ITM.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_DIST_ITM.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_DIST_ITM.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_DIST_ITM.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_DIST_ITM.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Distribusi',
							press:{
								enter:function(){
									_click('INV_DIST_ITM.search.btnSearch');
								}
							},
							id:'INV_DIST_ITM.search.f1'
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
											_click('INV_DIST_ITM.search.btnSearch');
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
											_click('INV_DIST_ITM.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Nama Partner',
							press:{
								enter:function(){
									_click('INV_DIST_ITM.search.btnSearch');
								}
							},
							id:'INV_DIST_ITM.search.f6'
						},{ 
							xtype:'idropdown',
							id : 'INV_DIST_ITM.search.f9',
							parameter:'STAT_SEND',
							name : 'f9',
							width: 200,
							press:{
								enter:function(){
									_click('INV_DIST_ITM.search.btnSearch');
								},
							},
							fieldLabel:'Status'
						},{ 
							xtype:'idropdown',
							id : 'INV_DIST_ITM.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_DIST_ITM.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_DIST_ITM.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_DIST_ITM.search.panel').qParams();
					arr['unit_id']=Ext.getCmp('INV_DIST_ITM.conf.unit').getValue();
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('INV_DIST_ITM.dropdown').getValue()]=Ext.getCmp('INV_DIST_ITM.text').getValue();
					obj['unit_id']=Ext.getCmp('INV_DIST_ITM.conf.unit').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_DIST_ITM&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_DIST_ITM_DELETE',function(){
						Ext.getCmp('INV_DIST_ITM.confirm').confirm({
							msg : "Apakah akan menghapus No. Penjualan '"+a.f1+"'",
							allow : 'INV_DIST_ITM.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_DIST_ITM&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_DIST_ITM.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_DIST_ITM.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_DIST_ITM.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_DIST_ITM.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_DIST_ITM_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_DIST_ITM&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_DIST_ITM.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('INV_DIST_ITM.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
									Ext.getCmp('INV_DIST_ITM.input.panel').qReset();
									Ext.getCmp('INV_DIST_ITM.input.f3').setValue({i:o.partners_id,name:o.partners});
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.dist_detail_id);
										table._get('barang',i).setValue({i:obj.trans_detail_id,name:obj.item_name});
										table._get('qty_dist',i)._setValue(obj.qty_dist);
										table._get('qty_sisa',i)._setValue(obj.qty_sisa);
										table._get('no_jual',i).setValue(obj.trans_code);
										table._get('tgl_jual',i).setValue(obj.trans_on);
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('qty_dist',i).setReadOnly(true);
											table._get('del',i).disable();
										}
									}
									table._getAddButton().disable();
									table.loadQuery=true;
									Ext.getCmp('INV_DIST_ITM.input.i').setValue(a.i);
									Ext.getCmp('INV_DIST_ITM.input.f1').setValue(a.f1);
									Ext.getCmp('INV_DIST_ITM.input.f2').setValue(a.f2);
									Ext.getCmp('INV_DIST_ITM.input.f4').setValue(o.status);
									Ext.getCmp('INV_DIST_ITM.input.f5').setValue(o.send_by);
									if(o.posted ==0){
										// Ext.getCmp('INV_DIST_ITM.input.panel').enable();
										// Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
										Ext.getCmp('INV_DIST_ITM.input.btnPosting').enable();
										Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').disable();
										Ext.getCmp('INV_DIST_ITM.input.btnUnposting').disable();
										Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(false);
									}else{
										// Ext.getCmp('INV_DIST_ITM.input.panel').disable();
										// Ext.getCmp('INV_DIST_ITM.input.btnSave').disable();
										Ext.getCmp('INV_DIST_ITM.input.btnPosting').disable();
										Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').enable();
										Ext.getCmp('INV_DIST_ITM.input.btnUnposting').enable();
										Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(true);
									}
									Ext.getCmp('INV_DIST_ITM.input').closing = false;
									Ext.getCmp('INV_DIST_ITM.input').show();
									Ext.getCmp('INV_DIST_ITM.input').setTitle('Distribusi');
									Ext.getCmp('INV_DIST_ITM.input.f2').focus();
									Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_DIST_ITM.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_DIST_ITM.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_DIST_ITM.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',{
					xtype:'iconfig',
					code:[
						iif(_access('INV_DIST_ITM_config_UNIT_ID')==false,'UNIT_ID',null),
						iif(_access('INV_DIST_ITM_config_DEFAULT_SEND_BY')==false,'DEFAULT_SEND_BY',null),
						iif(_access('INV_DIST_ITM_config_SJ_PREVIEW')==false,'SJ_PREVIEW',null),
					]
				},'-','->','-',{
				xtype:'ihiddenfield',
				id:'INV_DIST_ITM.conf.unit',
				value:1
			},{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'INV_DIST_ITM.btnAdd',
				iconCls: 'fa fa-plus',
				handler:function(a){
					Ext.getCmp('INV_DIST_ITM.input.panel').enable();
					Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
					Ext.getCmp('INV_DIST_ITM.input.panel').qReset();
					Ext.getCmp('INV_DIST_ITM.input.tableOption').resetTable();
					Ext.getCmp('INV_DIST_ITM.input').closing = false;
					Ext.getCmp('INV_DIST_ITM.input.btnPosting').enable();
					Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').disable();
					Ext.getCmp('INV_DIST_ITM.input.btnUnposting').disable();
					Ext.getCmp('INV_DIST_ITM.input').show();
					Ext.getCmp('INV_DIST_ITM.input').setTitle('Distribusi');
					Ext.getCmp('INV_DIST_ITM.input.f2').focus();
					Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(false);
					Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
				}
			},{
					xtype:'idropdown',
					id : 'INV_DIST_ITM.dropdown',
					emptyText:'Pencarian',
					margin:false,
					value:'f1',
					data:[
						{id:'f1',text:'No. Distribusi'},
						{id:'f6',text:'Nama Partner'},
					],
					width: 150,
					press:{
						enter:function(){
							_click('INV_DIST_ITM.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_DIST_ITM.text',
					press:{
						enter:function(){
							_click('INV_DIST_ITM.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_DIST_ITM.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_DIST_ITM.list').refresh(false);
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_DIST_ITM.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_DIST_ITM.search').show();
						Ext.getCmp('INV_DIST_ITM.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Distribusi',width: 120, dataIndex: 'f1' },
				{ text: 'Tgl. Distribusi',width: 100,dataIndex: 'f2'},
				{ text: 'Partner',flex: 1,dataIndex: 'f4' },
				{ text: 'Keterangan',width: 200,dataIndex: 'f3'},
				{ text: 'Status',width: 100,align:'center',dataIndex: 'f6'},
				{ text: 'Posting',width: 50,sortable :false,dataIndex: 'f5',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check"></span>';
						return '<span class="fa fa-close"></span>';
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_DIST_ITM.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_DIST_ITM.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			xtype:'iwindow',
			id:'INV_DIST_ITM.input',
			modal : true,
			maximized:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_DIST_ITM.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_DIST_ITM.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_DIST_ITM.input.btnNew');
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
				text: 'New',
				tooltip:'New <b>[F6]</b>',
				id:'INV_DIST_ITM.input.btnNew',
				iconCls:'fa fa-file',
				handler: function() {
					var $this = this;
					$this.closing = false;
					if (Ext.getCmp('INV_DIST_ITM.input.panel').qGetForm() == false)
						Ext.getCmp('INV_DIST_ITM.confirm').confirm({
							msg :'Apakah akan mengabaikan data yang sudah diubah?',
							allow : 'INV_DIST_ITM.close',
							onY : function() {
								// Ext.getCmp('INV_DIST_ITM.input.panel').enable();
								// Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
								Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(false);
								Ext.getCmp('INV_DIST_ITM.input.panel').qReset();
								Ext.getCmp('INV_DIST_ITM.input.tableOption').resetTable();
								Ext.getCmp('INV_DIST_ITM.input.btnPosting').enable();
								Ext.getCmp('INV_DIST_ITM.input.btnUnposting').disable();
								Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').disable();
								Ext.getCmp('INV_DIST_ITM.input').closing = false;
								Ext.getCmp('INV_DIST_ITM.input').setTitle('Penerimaan Vendor');
								Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
								Ext.getCmp('INV_DIST_ITM.input.f2').focus();
							}
						});
					else{
						// Ext.getCmp('INV_DIST_ITM.input.panel').enable();
						// Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
						Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(false);
						Ext.getCmp('INV_DIST_ITM.input.panel').qReset();
						Ext.getCmp('INV_DIST_ITM.input.tableOption').resetTable();
						Ext.getCmp('INV_DIST_ITM.input.btnPosting').enable();
						Ext.getCmp('INV_DIST_ITM.input.btnUnposting').disable();
						Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').disable();
						Ext.getCmp('INV_DIST_ITM.input').closing = false;
						Ext.getCmp('INV_DIST_ITM.input').setTitle('Penerimaan Vendor');
						Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
						Ext.getCmp('INV_DIST_ITM.input.f2').focus();
					}
					return false;
				}
			},'-',{
				text: 'Simpan',
				tooltip:'Simpan <b>[Ctrl+s]</b>',
				id:'INV_DIST_ITM.input.btnSave',
				iconCls:'fa fa-save',
				handler: function() {
					var req=Ext.getCmp('INV_DIST_ITM.input.panel').qGetForm(true);
					if(req == false){
						var error=false;
						var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
						var objCek={};
						for(var i=0,iLen=table._getTotal();i<iLen;i++){
							if(table._get('qty_dist',i)._getValue()==0){
								Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
								table._get(qty_dist).focus();
								return false;
							}
							if(objCek[table._get('barang',i).getValue()]== undefined){
								objCek[table._get('barang',i).getValue()]='ADA';
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Barang dengan No. Jual tidak boleh sama.',type : 'warning'});
								table._get('barang',i).focus();
								return false;
							}
						}
						Ext.getCmp('INV_DIST_ITM.confirm').confirm({
							msg : 'Apakah akan menyimpan data ini?',
							allow : 'INV_DIST_ITM.save',
							onY : function() {
								var param = Ext.getCmp('INV_DIST_ITM.input.panel').qParams();
								param['unit_id']=Ext.getCmp('INV_DIST_ITM.conf.unit').getValue();
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_DIST_ITM&f=save',
									method : 'POST',
									params:param,
									before:function(){
										Ext.getCmp('INV_DIST_ITM.input').setLoading('Menyimpan');
									},
									success : function(response) {
										Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
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
											Ext.getCmp('INV_DIST_ITM.input.panel').enable();
											Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
											Ext.getCmp('INV_DIST_ITM.input.i').setValue(r.d.id);
											Ext.getCmp('INV_DIST_ITM.input.f1').setValue(r.d.code);
											Ext.getCmp('INV_DIST_ITM.list').refresh();
											Ext.getCmp('INV_DIST_ITM.input.f2').focus();
											Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}else if(req==true)
						Ext.getCmp('INV_DIST_ITM.input').qClose();
				}
			},'-',{
				text: 'Posting',
				tooltip:'Posting <b>[Esc]</b>',
				id:'INV_DIST_ITM.input.btnPosting',
				iconCls:'fa fa-check',
				handler: function() {
					if(Ext.getCmp('INV_DIST_ITM.input.c').getValue()==''){
						Ext.getCmp('INV_DIST_ITM.input.c').setValue('Y');
					}else{
						Ext.getCmp('INV_DIST_ITM.input.c').setValue('');
					}
					var req=Ext.getCmp('INV_DIST_ITM.input.panel').qGetForm(true);
					if(req == false){
						var error=false;
						var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
						var objCek={};
						for(var i=0,iLen=table._getTotal();i<iLen;i++){
							if(table._get('qty_dist',i)._getValue()==0){
								Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
								table._get(qty_dist).focus();
								return false;
							}
							if(objCek[table._get('barang',i).getValue()]== undefined){
								objCek[table._get('barang',i).getValue()]='ADA';
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Barang dengan No. Jual tidak boleh sama.',type : 'warning'});
								table._get('barang',i).focus();
								return false;
							}
						}
						Ext.getCmp('INV_DIST_ITM.confirm').confirm({
							msg : 'Apakah akan di Posting?',
							allow : 'INV_DIST_ITM.posting',
							onY : function() {
								var param = Ext.getCmp('INV_DIST_ITM.input.panel').qParams();
								param['unit_id']=Ext.getCmp('INV_DIST_ITM.conf.unit').getValue();
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_DIST_ITM&f=posting',
									method : 'POST',
									params:param,
									before:function(){
										Ext.getCmp('INV_DIST_ITM.input').setLoading('Menyimpan');
									},
									success : function(response) {
										Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
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
											for(var i=0, iLen=table._getTotal(); i<iLen;i++){
												table._get('barang',i).setReadOnly(true);
												table._get('qty_dist',i).setReadOnly(true);
												table._get('del',i).disable();
											}
											table._getAddButton().disable();
											// Ext.getCmp('INV_DIST_ITM.input.panel').disable();
											Ext.getCmp('INV_DIST_ITM.input.i').setValue(r.d.id);
											Ext.getCmp('INV_DIST_ITM.input.f1').setValue(r.d.code);
											Ext.getCmp('INV_DIST_ITM.list').refresh();
											Ext.getCmp('INV_DIST_ITM.input.btnPosting').disable();
											Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').enable();
											// Ext.getCmp('INV_DIST_ITM.input.btnSave').disable();
											Ext.getCmp('INV_DIST_ITM.input.btnUnposting').enable();
											Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(true);
											Ext.getCmp('INV_DIST_ITM.input.f2').focus();
											Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}else if(req==true)
						Ext.getCmp('INV_DIST_ITM.input').qClose();
				}
			},{
				text: 'Unposting',
				tooltip:'Unposting <b>[Esc]</b>',
				id:'INV_DIST_ITM.input.btnUnposting',
				iconCls:'fa fa-close',
				handler: function() {
					Ext.getCmp('INV_DIST_ITM.confirm').confirm({
						msg : 'Apakah akan di UnPosting?',
						allow : 'INV_DIST_ITM.posting',
						onY : function() {
							
							Ext.Ajax.request({
								url : url + 'cmd?m=INV_DIST_ITM&f=unposting',
								method : 'POST',
								params:{i:Ext.getCmp('INV_DIST_ITM.input.i').getValue()},
								before:function(){
									Ext.getCmp('INV_DIST_ITM.input').setLoading('Menyimpan');
								},
								success : function(response) {
									Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('INV_DIST_ITM.list').refresh();
										var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
										for(var i=0, iLen=table._getTotal(); i<iLen;i++){
											table._get('barang',i).setReadOnly(false);
											table._get('qty_dist',i).setReadOnly(false);
											table._get('del',i).enable();
										}
										table._getAddButton().enable();
										
										// Ext.getCmp('INV_DIST_ITM.input.panel').enable();
										// Ext.getCmp('INV_DIST_ITM.input.btnSave').enable();
										Ext.getCmp('INV_DIST_ITM.input.btnPosting').enable();
										Ext.getCmp('INV_DIST_ITM.input.btnPrintSJ').disable();
										Ext.getCmp('INV_DIST_ITM.input.btnUnposting').disable();
										Ext.getCmp('INV_DIST_ITM.input.f3').setReadOnly(false);
										Ext.getCmp('INV_DIST_ITM.input.f2').focus();
										Ext.getCmp('INV_DIST_ITM.input.panel').qSetForm();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('INV_DIST_ITM.input').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						}
					});
				}
			},'-',{
				text:'Keluar',
				tooltip:'Keluar <b>[Esc]</b>',
				id:'INV_DIST_ITM.input.btnClose',
				iconCls:'fa fa-close',
				handler: function() {
					Ext.getCmp('INV_DIST_ITM.input').close();
				}
			},'-',{
				text:'Print',
				iconCls:'fa fa-print',
				menu:{
					xtype:'menu',
					items:[
						{
							text:'Surat Jalan',
							id:'INV_DIST_ITM.input.btnPrintSJ',
							handler:function(){
								_access('INV_DIST_ITM_print_sj',function(){
									Ext.getCmp('INV_DIST_ITM.confirm').confirm({
										msg :'Apakah akan cetak Surat Jalan?',
										allow : 'INV_DIST_ITM.close',
										onY : function() {
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_DIST_ITM&f=printSj',
												method : 'POST',
												params:{i:Ext.getCmp('INV_DIST_ITM.input.i').getValue()},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S') {
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								})
							}
						}
					]
				}
			},'-'],
			items:[
				{
					xtype:'ipanel',
					paddingBottom:false,
					id : 'INV_DIST_ITM.input.panel',
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
									id:'INV_DIST_ITM.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_DIST_ITM.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_DIST_ITM.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Distribusi'
								},{
									xtype:'idatefield',
									id : 'INV_DIST_ITM.input.f2',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Distribusi'
								},{
									xtype:'iselect',
									fieldLabel:'Partners',
									labelAlign:'top',
									width: 250,
									id:'INV_DIST_ITM.input.f3',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'f3',
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
										table.resetTable();
									},
									button:{
										urlData:url + 'cmd?m=INV_DIST_ITM&f=getListPartners',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Partner',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Partner',
											},{
												xtype:'idropdown',
												name : 'f3',
												fieldLabel:'Jenis Partner',
												query:"SELECT partners_type_id AS id,CONCAT(partners_type_code,' - ',partners_type_name) AS text FROM inv_partners_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY partners_type_code ASC",
											},{
												xtype:'itextfield',
												name:'f14',
												fieldLabel:'No. PAK',
											},{
												xtype:'itextfield',
												name:'f4',
												fieldLabel:'PIC',
											},{
												name:'f5',
												xtype:'itextfield',
												fieldLabel:'Email',
											},{
												name:'f15',
												xtype:'itextfield',
												fieldLabel:'Telepon',
											},{
												xtype:'itextfield',
												name:'f16',
												fieldLabel:'Fax',
											},{
												xtype:'itextfield',
												name:'f6',
												fieldLabel:'Alamat',
											},{
												xtype:'itextfield',
												name:'f7',
												type:'DYNAMIC_COUNTRY',
												fieldLabel:'Negara',
											},{
												xtype:'itextfield',
												name:'f8',
												fieldLabel:'Provinsi',
											},{
												xtype:'itextfield',
												name:'f9',
												fieldLabel:'Kota',
											},{
												xtype:'itextfield',
												name:'f10',
												fieldLabel:'Kecamatan',
											},{
												xtype:'itextfield',
												name:'f11',
												fieldLabel:'Kelurahan',
											},{
												xtype:'idropdown',
												id : 'INV_DIST_ITM.input.f4.f12',
												parameter:'ACTIVE_FLAG',
												name : 'f12',
												fieldLabel:'Perizinan'
											},{
												xtype:'idropdown',
												parameter:'ACTIVE_FLAG',
												name : 'f13',
												width: 200,
												fieldLabel: 'Aktif'
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ text: 'Partner',width: 200, dataIndex: 'name'  },
											{ text: 'Jenis Partner',width: 200,dataIndex: 'type' },
											{ text: 'Email',width: 150, dataIndex:'email'},
											{ text: 'Alamat',flex:1, dataIndex: 'address' },
											{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
												renderer: function(value){
													if(value==true)
														return '<span class="fa fa-check"></span>';
													return '<span class="fa fa-close"></span>';
												}
											}
										]
									}
								},{
									xtype:'idropdown',
									id : 'INV_DIST_ITM.input.f4',
									labelAlign:'top',
									allowBlank : false,
									name : 'f4',
									parameter:'STAT_SEND',
									value:getSetting('INV_DIST_ITM','DEFAULT_STATUS'),
									width: 100,
									fieldLabel:'Status'
								},{
									xtype:'itextfield',
									id : 'INV_DIST_ITM.input.f5',
									labelAlign:'top',
									allowBlank : false,
									name : 'f5',
									value:getSetting('INV_DIST_ITM','DEFAULT_SEND_BY'),
									width: 150,
									fieldLabel:'Pengirim'
								}		
							]
						},{
							xtype:'ilistinput',
							id:'INV_DIST_ITM.input.tableOption',
							name:'options',
							flex:1,
							bodyStyle:'margin-left: -1px;margin-right: -1px;',
							margin:false,
							loadQuery:true,
							items:[
								{
									xtype:'iselect',
									width: 250,
									text:'Barang',
									emptyText:'Barang',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onBeforeShow:function(ini,list){
										list[1].setValue(Ext.getCmp('INV_DIST_ITM.input.f3').getValue());
										list[2].setValue(Ext.getCmp('INV_DIST_ITM.conf.unit').getValue());
									},
									onReset:function(a){
										var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
										if(table.loadQuery==true){
											table._get('no_jual',b.line).setValue(a.no_jual);
											table._get('tgl_jual',b.line).setValue(a.tgl);
											table._get('qty_sisa',b.line)._setValue(a.qty);
											table._get('qty_dist',b.line)._setValue(a.qty);
										}
									},
									button:{
										urlData : url + 'cmd?m=INV_DIST_ITM&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'f3',
											},{
												xtype:'ihiddenfield',
												name:'f4',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ text: 'No. Jual',width: 80, dataIndex: 'no_jual'},
											{ text: 'Tgl. Jual',width: 80, dataIndex: 'tgl'},
											{ text: 'Kode Gin',width: 100, dataIndex: 'gin'},
											{ text: 'Barang',flex:1, dataIndex: 'name'},
											{ text: 'Qty',width: 100, dataIndex:'qty',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_k;
												}
											}
										]
									}
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'itextfield',
									name:'no_jual',
									text:'No. Jual',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:120,
									emptyText:'No. Jual',
								},{
									xtype:'idatefield',
									name:'tgl_jual',
									text:'Tgl. Jual',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:120,
									emptyText:'Tgl. Jual',
								},{
									xtype:'inumberfield',
									name:'qty_sisa',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Sisa',
									allowBlank: false,
									emptyText:'Sisa',
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty_dist',
									align:'right',
									text:'Dist',
									allowBlank: false,
									emptyText:'Dist',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_DIST_ITM.input.tableOption');
											if(table._get('qty_sisa',a.line)._getValue()<a._getValue()){
												Ext.create('App.cmp.Toast').toast({msg : 'Qty Distribusi Tidak Boleh Lebih dari '+table._get('qty_sisa',a.line)._getValue()+'.',type : 'warning'});
												table._get('qty_dist',a.line).focus();
											}
										}
									},
									app:{decimal:0},
									width: 40,
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_DIST_ITM.input.panel').qGetForm() == false)
					Ext.getCmp('INV_DIST_ITM.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_DIST_ITM.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_DIST_ITM.confirm'}
	]
});