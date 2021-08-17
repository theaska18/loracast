shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_CLOSE_MONTH.list').refresh();
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_CLOSE_MONTH.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'itable',
			id:'INV_CLOSE_MONTH.list',
			params:function(bo){
				var obj={};
				obj['tahun']=Ext.getCmp('INV_CLOSE_MONTH.dropdown').getValue();
				return obj;
			},
			url:url + 'cmd?m=INV_CLOSE_MONTH&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',{
					xtype:'iconfig',
					code:[
						iif(_access('INV_CLOSE_MONTH_config_UNIT_ID')==false,'UNIT_ID',null)
					]
				},'-','->',
				{
					xtype:'itextfield',
					id : 'INV_CLOSE_MONTH.dropdown',
					emptyText:'Tahun',
					fieldLabel:'Tahun',
					margin:false,
					value:String(new Date().getFullYear()),
					displayField:'id',
					// url:url + 'cmd?m=INV_CLOSE_MONTH&f=getYears',
					width: 200,
					press:{
						enter:function(){
							_click('INV_CLOSE_MONTH.btnRefresh');
						}
					}
				},{
					iconCls: 'fa fa-refresh',
					tooltip:'Refresh [F5]',
					id:'INV_CLOSE_MONTH.btnRefresh',
					handler : function(a) {
						Ext.getCmp('INV_CLOSE_MONTH.list').refresh(false);
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ hidden:true,hideable:false,dataIndex: 'd' },
				{ hidden:true,hideable:false,dataIndex: 'f4' },
				// { hidden:true,hideable:false,dataIndex: 'c' },
				{ text: 'Bulan',width: 120, dataIndex: 'f1' },
				// { text: 'Tgl Proses',width: 200,dataIndex: 'f2'},
				{ text: 'Tutup',width: 50,sortable :false,dataIndex: 'f3',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check"></span>';
						return '<span class="fa fa-close"></span>';
					}
				},{
					text: 'Proses',
					xtype: 'actioncolumn',
					iconCls:'fa fa-refresh',
					isDisabled:function(grid, rowIndex, colIndex, actionItem, record){
						console.log(record.data.f4)
						if(record.data.f4==1){
							return true;
						}else{
							return false;
						}
					},
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						var a=record.data;
						console.log(a);
						_access('INV_CLOSE_MONTH_PROSES',function(){
							Ext.getCmp('INV_CLOSE_MONTH.confirm').confirm({
								msg :"Apakah akan Proses Bulan '"+a.f1+"' Tahun '"+Ext.getCmp('INV_CLOSE_MONTH.dropdown').getValue()+"'",
								allow : 'INV_CLOSE_MONTH.delete',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=INV_CLOSE_MONTH&f=proses',
										method : 'POST',
										params : {
											tahun : Ext.getCmp('INV_CLOSE_MONTH.dropdown').getValue(),
											bulan : a.d,
											unit : getSetting('INV_CLOSE_MONTH','UNIT_ID'),
											tutup:0
										},
										before:function(){
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S')
												Ext.getCmp('INV_CLOSE_MONTH.list').refresh();
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						});
					}
				},{
					text: 'Tutup',
					xtype: 'actioncolumn',
					iconCls:'fa fa-close',
					isDisabled:function(grid, rowIndex, colIndex, actionItem, record){
						console.log(record.data.f4)
						if(record.data.f4==1){
							return true;
						}else{
							return false;
						}
					},
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						var a=record.data;
						_access('INV_CLOSE_MONTH',function(){
							Ext.getCmp('INV_CLOSE_MONTH.confirm').confirm({
								msg :"Apakah akan Tutup Bulan '"+a.f1+"' Tahun '"+Ext.getCmp('INV_CLOSE_MONTH.dropdown').getValue()+"'",
								allow : 'INV_CLOSE_MONTH.delete',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=INV_CLOSE_MONTH&f=proses',
										method : 'POST',
										params : {
											tahun : Ext.getCmp('INV_CLOSE_MONTH.dropdown').getValue(),
											bulan : a.d,
											unit : getSetting('INV_CLOSE_MONTH','UNIT_ID'),
											tutup:1
										},
										before:function(){
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S')
												Ext.getCmp('INV_CLOSE_MONTH.list').refresh();
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('INV_CLOSE_MONTH.list').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						});
					}
				}
			]
		},{xtype:'iconfirm',id : 'INV_CLOSE_MONTH.confirm'}
	]
});