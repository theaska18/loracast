shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_STK_OPNM.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_STK_OPNM.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_STK_OPNM.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_STK_OPNM.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	xtype:'panel',
	id : 'INV_STK_OPNM.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_STK_OPNM.search',
			modal:false,
			title:'Stok Opname - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_STK_OPNM.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_STK_OPNM.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_STK_OPNM.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_STK_OPNM.search.f1').focus();
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
					id:'INV_STK_OPNM.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_STK_OPNM.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_STK_OPNM.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_STK_OPNM.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_STK_OPNM.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STK_OPNM.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Opname',
							press:{
								enter:function(){
									_click('INV_STK_OPNM.search.btnSearch');
								}
							},
							id:'INV_STK_OPNM.search.f1'
						},{
							xtype:'iinput',
							label : 'Tgl. Opname',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('INV_STK_OPNM.search.btnSearch');
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
											_click('INV_STK_OPNM.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{ 
							xtype:'idropdown',
							id : 'INV_STK_OPNM.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_STK_OPNM.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_STK_OPNM.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_STK_OPNM.search.panel').qParams();
					arr['unit_id']=Ext.getCmp('INV_STK_OPNM.conf.unit').getValue();
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('INV_STK_OPNM.dropdown').getValue()]=Ext.getCmp('INV_STK_OPNM.text').getValue();
					obj['posted']='Y';
					obj['unit_id']=Ext.getCmp('INV_STK_OPNM.conf.unit').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_STK_OPNM&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_STK_OPNM_DELETE',function(){
						Ext.getCmp('INV_STK_OPNM.confirm').confirm({
							msg : "Apakah akan menghapus No. Opname '"+a.f1+"'",
							allow : 'INV_STK_OPNM.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_STK_OPNM&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_STK_OPNM.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_STK_OPNM.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_STK_OPNM.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_STK_OPNM.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_STK_OPNM_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_STK_OPNM&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_STK_OPNM.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('INV_STK_OPNM.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
									Ext.getCmp('INV_STK_OPNM.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.trans_detail_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('fraction',i).setValue(obj.fraction);
										table._get('qty',i)._setValue(obj.qty);
										table._get('qty_dist',i)._setValue(obj.qty_dist);
										table._get('qty_sisa',i)._setValue(obj.qty_sisa);
										table._get('sat_kecil',i).setValue(obj.measurement_name);
										table._get('sat_kecil_id',i).setValue(obj.measurement_id);
										table._get('gin',i).setValue(obj.gin_code);
										table._get('gin_id',i).setValue(obj.gin_id);
										table._get('harga',i)._setValue(obj.price);
										table.countLine(i);
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('qty_dist',i).setReadOnly(true);
											table._get('harga',i).setReadOnly(true);
											table._get('del',i).disable();
											table._getAddButton().disable();
										}
									}
									table.loadQuery=true;
									Ext.getCmp('INV_STK_OPNM.input.i').setValue(a.i);
									Ext.getCmp('INV_STK_OPNM.input.f1').setValue(a.f1);
									Ext.getCmp('INV_STK_OPNM.input.f2').setValue(a.f2);
									Ext.getCmp('INV_STK_OPNM.input.f4').setValue(o.description);
									if(o.posted ==0){
										Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
										Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-check');
										Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Posting');
										Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(false);
										Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(false);
									}else{
										Ext.getCmp('INV_STK_OPNM.input.btnSave').disable();
										Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-close');
										Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Unposting');
										Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(true);
										Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(true);
									}
									table.count();
									Ext.getCmp('INV_STK_OPNM.input').closing = false;
									Ext.getCmp('INV_STK_OPNM.input').show();
									Ext.getCmp('INV_STK_OPNM.input').setTitle('Stok Opname');
									Ext.getCmp('INV_STK_OPNM.input.f2').focus();
									Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_STK_OPNM.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_STK_OPNM.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_STK_OPNM.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-','->','-',{
				xtype:'ihiddenfield',
				id:'INV_STK_OPNM.conf.unit',
				value:1
			},{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'INV_STK_OPNM.btnAdd',
				iconCls: 'fa fa-plus',
				handler:function(a){
					var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
					table._getAddButton().enable();
					Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
					Ext.getCmp('INV_STK_OPNM.input.panel').qReset();
					table.resetTable();
					Ext.getCmp('INV_STK_OPNM.input').closing = false;
					Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-check');
					Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Posting');
					Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(false);
					Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(false);
					Ext.getCmp('INV_STK_OPNM.input').show();
					Ext.getCmp('INV_STK_OPNM.input').setTitle('Stok Opname');
					Ext.getCmp('INV_STK_OPNM.input.f2').focus();
					Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
				}
			},{
					xtype:'idropdown',
					id : 'INV_STK_OPNM.dropdown',
					emptyText:'Pencarian',
					margin:false,
					value:'f1',
					data:[
						{id:'f1',text:'No. Opname'}
					],
					width: 150,
					press:{
						enter:function(){
							_click('INV_STK_OPNM.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_STK_OPNM.text',
					press:{
						enter:function(){
							_click('INV_STK_OPNM.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_STK_OPNM.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_STK_OPNM.list').refresh(false);
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_STK_OPNM.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_STK_OPNM.search').show();
						Ext.getCmp('INV_STK_OPNM.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Opname',width: 120,align:'center', dataIndex: 'f1' },
				{ text: 'Tgl. Opname',width: 100,align:'center',dataIndex: 'f2'},
				{ text: 'Keterangan',flex: 1,dataIndex: 'f3'},
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
						Ext.getCmp('INV_STK_OPNM.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_STK_OPNM.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			xtype:'iwindow',
			id:'INV_STK_OPNM.input',
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
									_click('INV_STK_OPNM.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_STK_OPNM.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_STK_OPNM.input.btnNew');
								}
							},{
								key:'f7',
								fn:function(){
									_click('INV_STK_OPNM.input.btnPosting');
								}
							},{
								key:'f8',
								fn:function(){
									_click('INV_STK_OPNM.input.btnPay');
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
				id:'INV_STK_OPNM.input.btnNew',
				iconCls:'fa fa-file',
				handler: function() {
					var $this = this;
					$this.closing = false;
					if (Ext.getCmp('INV_STK_OPNM.input.panel').qGetForm() == false)
						Ext.getCmp('INV_STK_OPNM.confirm').confirm({
							msg :'Apakah akan mengabaikan data yang sudah diubah?',
							allow : 'INV_STK_OPNM.close',
							onY : function() {
								var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
								table._getAddButton().enable();
								Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
								Ext.getCmp('INV_STK_OPNM.input.panel').qReset();
								table.resetTable();
								Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-check');
								Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Posting');
								Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(false);
								Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(false);
								
								Ext.getCmp('INV_STK_OPNM.input').closing = false;
								Ext.getCmp('INV_STK_OPNM.input').setTitle('Penerimaan Vendor');
								Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
								Ext.getCmp('INV_STK_OPNM.input.f2').focus();
							}
						});
					else{
						Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
						Ext.getCmp('INV_STK_OPNM.input.panel').qReset();
						Ext.getCmp('INV_STK_OPNM.input.tableOption').resetTable();
						Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-check');
						Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Posting');
						Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(false);
						Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(false);
						
						Ext.getCmp('INV_STK_OPNM.input').closing = false;
						Ext.getCmp('INV_STK_OPNM.input').setTitle('Penerimaan Vendor');
						Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
						Ext.getCmp('INV_STK_OPNM.input.f2').focus();
					}
					return false;
				}
			},'-',{
				text: 'Simpan',
				tooltip:'Simpan <b>[Ctrl+s]</b>',
				id:'INV_STK_OPNM.input.btnSave',
				iconCls:'fa fa-save',
				handler: function() {
					var req=Ext.getCmp('INV_STK_OPNM.input.panel').qGetForm(true);
					if(req == false){
						var error=false;
						var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
						var objCek={};
						for(var i=0,iLen=table._getTotal();i<iLen;i++){
							if(table._get('qty',i)._getValue()==0){
								Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
								table._get('qty',i).focus();
								return false;
							}
							if(objCek[table._get('gin',i).getValue()]== undefined){
								objCek[table._get('gin',i).getValue()]='ADA';
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
								table._get('barang',i).focus();
								return false;
							}
						}
						Ext.getCmp('INV_STK_OPNM.confirm').confirm({
							msg : 'Apakah akan menyimpan data ini?',
							allow : 'INV_STK_OPNM.save',
							onY : function() {
								var param = Ext.getCmp('INV_STK_OPNM.input.panel').qParams();
								param['unit_id']=Ext.getCmp('INV_STK_OPNM.conf.unit').getValue();
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_STK_OPNM&f=save',
									method : 'POST',
									params:param,
									before:function(){
										Ext.getCmp('INV_STK_OPNM.input').setLoading('Menyimpan');
									},
									success : function(response) {
										Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
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
											Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
											Ext.getCmp('INV_STK_OPNM.input.i').setValue(r.d.id);
											Ext.getCmp('INV_STK_OPNM.input.f1').setValue(r.d.code);
											Ext.getCmp('INV_STK_OPNM.list').refresh();
											Ext.getCmp('INV_STK_OPNM.input.f2').focus();
											Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}else if(req==true)
						Ext.getCmp('INV_STK_OPNM.input').qClose();
				}
			},'-',{
				text: 'Posting',
				tooltip:'Posting/UnPosting <b>[F7]</b>',
				id:'INV_STK_OPNM.input.btnPosting',
				iconCls:'fa fa-check',
				handler: function(a) {
					if(a.getText()=='Posting'){
						_access('INV_STK_OPNM_posting',function(){
							if(Ext.getCmp('INV_STK_OPNM.input.c').getValue()==''){
								Ext.getCmp('INV_STK_OPNM.input.c').setValue('Y');
							}else{
								Ext.getCmp('INV_STK_OPNM.input.c').setValue('');
							}
							var req=Ext.getCmp('INV_STK_OPNM.input.panel').qGetForm(true);
							if(req == false){
								var error=false;
								var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
								var objCek={};
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									if(table._get('qty',i)._getValue()==0){
										Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
										table._get('qty',i).focus();
										return false;
									}
									if(objCek[table._get('gin',i).getValue()]== undefined){
										objCek[table._get('gin',i).getValue()]='ADA';
									}else{
										Ext.create('App.cmp.Toast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
										table._get('barang',i).focus();
										return false;
									}
								}
								Ext.getCmp('INV_STK_OPNM.confirm').confirm({
									msg : 'Apakah akan di Posting?',
									allow : 'INV_STK_OPNM.posting',
									onY : function() {
										var param = Ext.getCmp('INV_STK_OPNM.input.panel').qParams();
										param['unit_id']=Ext.getCmp('INV_STK_OPNM.conf.unit').getValue();
										Ext.Ajax.request({
											// url : url + 'cmd?m=INV_STK_OPNM&f=posting',
											method : 'POST',
											params:param,
											before:function(){
												Ext.getCmp('INV_STK_OPNM.input').setLoading('Menyimpan');
											},
											success : function(response) {
												Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
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
													var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
													for(var i=0, iLen=table._getTotal(); i<iLen;i++){
														table._get('barang',i).setReadOnly(true);
														table._get('qty',i).setReadOnly(true);
														table._get('qty_dist',i).setReadOnly(true);
														table._get('harga',i).setReadOnly(true);
														table._get('del',i).disable();
													}
													table._getAddButton().disable();
													Ext.getCmp('INV_STK_OPNM.input.i').setValue(r.d.id);
													Ext.getCmp('INV_STK_OPNM.input.f1').setValue(r.d.code);
													Ext.getCmp('INV_STK_OPNM.list').refresh();
													Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-close');
													Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Unposting');
													Ext.getCmp('INV_STK_OPNM.input.btnSave').disable();
													Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(true);
													Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(true);
													Ext.getCmp('INV_STK_OPNM.input.f2').focus();
													Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}else if(req==true){
								Ext.getCmp('INV_STK_OPNM.input').qClose();
							}
						});
					}else{
						_access('INV_STK_OPNM_unposting',function(){
							Ext.getCmp('INV_STK_OPNM.confirm').confirm({
								msg : 'Apakah akan di UnPosting?',
								allow : 'INV_STK_OPNM.posting',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=INV_STK_OPNM&f=unposting',
										method : 'POST',
										params:{i:Ext.getCmp('INV_STK_OPNM.input.i').getValue()},
										before:function(){
											Ext.getCmp('INV_STK_OPNM.input').setLoading('Menyimpan');
										},
										success : function(response) {
											Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
												for(var i=0, iLen=table._getTotal(); i<iLen;i++){
													table._get('barang',i).setReadOnly(false);
													table._get('qty',i).setReadOnly(false);
													table._get('qty_dist',i).setReadOnly(false);
													table._get('harga',i).setReadOnly(false);
													table._get('del',i).enable();
												}
												table._getAddButton().enable();
												Ext.getCmp('INV_STK_OPNM.list').refresh();
												Ext.getCmp('INV_STK_OPNM.input.btnSave').enable();
												Ext.getCmp('INV_STK_OPNM.input.btnPosting').setIconCls('fa fa-check');
												Ext.getCmp('INV_STK_OPNM.input.btnPosting').setText('Posting');
												Ext.getCmp('INV_STK_OPNM.input.f2').setReadOnly(false);
												Ext.getCmp('INV_STK_OPNM.input.f4').setReadOnly(false);
												
												Ext.getCmp('INV_STK_OPNM.input.f2').focus();
												Ext.getCmp('INV_STK_OPNM.input.panel').qSetForm();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('INV_STK_OPNM.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						});
					}
				}
			},'-'
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STK_OPNM.input.panel',
					paddingBottom:false,
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
									id:'INV_STK_OPNM.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_STK_OPNM.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_STK_OPNM.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Opname'
								},{
									xtype:'idatefield',
									id : 'INV_STK_OPNM.input.f2',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Opname'
								},{
									xtype:'itextfield',
									id : 'INV_STK_OPNM.input.f4',
									labelAlign:'top',
									maxLength:128,
									name : 'f4',
									width: 200,
									fieldLabel:'Keterangan'
								}	
							]
						},{
							xtype:'ilistinput',
							id:'INV_STK_OPNM.input.tableOption',
							name:'options',
							flex:3,
							bodyStyle:'margin-left: -1px;margin-right: -1px;',
							margin:false,
							loadQuery:true,
							items:[
								{
									xtype:'iselect',
									flex:1,
									text:'Barang',
									emptyText:'Barang',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onReset:function(a){
										var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
										
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_STK_OPNM&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
														table._get('qty',b.line)._setValue(a.stock);
														table._get('qty_sisa',b.line)._setValue(a.stock);
														table._get('gin',b.line).setValue(a.gin);
														table._get('gin_id',b.line).setValue(a.gin_id);
														table._get('sat_kecil',b.line).setValue(o.f2);
														table._get('sat_kecil_id',b.line).setValue(o.f1);
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									},onBeforeShow:function(){
										Ext.getCmp('INV_STK_OPNM.input.item.unit_id').setValue(Ext.getCmp('INV_STK_OPNM.conf.unit').getValue());
									},
									button:{
										urlData : url + 'cmd?m=INV_STK_OPNM&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'unit_id',
												id:'INV_STK_OPNM.input.item.unit_id',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											},{
												xtype:'itextfield',
												name:'f3',
												fieldLabel:'Deskripsi',
											},{
												xtype:'idropdown',
												fieldLabel:'Jenis Barang',
												parameter:'ITEM_TYPE',
												name : 'f4',
											},{
												xtype:'idropdown',
												parameter:'ACTIVE_FLAG',
												name : 'f5',
												width: 200,
												fieldLabel: 'Active'
											}
										],
										columns:[
											{ hidden:true,dataIndex: 'i'},
											{ hidden:true,dataIndex: 'gin_id'},
											{ text: 'Tgl. Expire',width: 80, dataIndex: 'expire'},
											{ text: 'Tgl. Terima',width: 80, dataIndex: 'tgl'},
											{ text: 'Kode Gin',width: 100, dataIndex: 'gin'},
											{ text: 'No. Terima',width: 100, dataIndex: 'terima'},
											{ text: 'Barang',flex:1, dataIndex: 'name'},
											{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_s;
												}
											},{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
												renderer: function(value){
													if(value==true)
														return '<span class="fa fa-check"></span>';
													return '<span class="fa fa-close"></span>';
												}
											}
										]
									}
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Kode Gin',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:120,
									emptyText:'Gin',
								},{
									xtype:'ihiddenfield',
									name:'gin_id'
								},{
									xtype:'itextfield',
									name:'sat_kecil',
									text:'Satuan',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'inumberfield',
									name:'qty_sisa',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Qty',
									allowBlank: false,
									app:{decimal:0},
									width: 80,
								},{
									xtype:'inumberfield',
									name:'qty',
									align:'right',
									text:'Opname',
									allowBlank: false,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_STK_OPNM.input.tableOption');
											table._get('value',a.line)._setValue(a._getValue()-table._get('qty_sisa',a.line)._getValue());
										}
									},
									app:{decimal:0},
									width: 80,
								},{
									xtype:'inumberfield',
									name:'value',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Value',
									app:{decimal:0},
									width: 80,
								},{
									xtype:'ihiddenfield',
									name:'sat_kecil_id'
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_STK_OPNM.input.panel').qGetForm() == false)
					Ext.getCmp('INV_STK_OPNM.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_STK_OPNM.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_STK_OPNM.confirm'}
	]
});