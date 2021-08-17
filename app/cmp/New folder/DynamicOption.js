Ext.define('App.cmp.DynamicOption', {
	extend:'App.cmp.Select',
	allowBlank : false,
	valueField:'text',
	textValue:true,
	dynamic:true,
	forceSelection :false,
	textField:'text',
	button:{},
	initComponent:function(){
		var $this=this,par=null;
		$this.onBeforeShow=function(){if($this.getParent != undefined){par.setValue($this.getParent());}};
		$this.button.windowWidth=350;
		var label='Cari';
		if($this.fieldLabel != undefined && $this.fieldLabel !=''){label=$this.fieldLabel;}
		$this.button.items=[
			{xtype:'itextfield',name:'f1',columnWidth: 1,emptyText:label,database:{table:'app_dynamic_option',field:'M.value',separator:'like'},press:{enter:function(){$this.refresh();}}},
			par=new Ext.create('App.cmp.HiddenField',{name:'f4',database:{table:'app_dynamic_option',field:'M.parent',}}),
			{xtype:'ihiddenfield',name:'f2',database:{table:'app_dynamic_option',field:'M.option_type',},value:$this.type}
		];
		$this.button.database={table:'app_dynamic_option'};
		$this.button.columns=[
			{ text: label,flex:1, dataIndex: 'value',database:{field:"DISTINCT(CONCAT(M.value,CASE WHEN M.parent IS NOT NULL AND M.parent <>'' AND M.value<>'-' THEN CONCAT(', ',M.parent) ELSE '' END)) AS value"} },
			{ hidden:true,sort:true,dataIndex: 'text',database:{field:'M.value as text'} },
			{
				text: 'Delete',
				xtype: 'actioncolumn',
				iconCls:'fa fa-trash',
				handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					Ext.MessageBox.confirm('Konfirmasi', 'Apakah Akan Hapus Dynamic "'+record.raw.text+'" ?', function(btn){
						if (btn == 'yes'){
							var splitnya=record.raw.value.split(', '),hasil=null;
							if(splitnya.length>1){hasil=splitnya[1];}
							Ext.Ajax.request({
								url : url + 'fn/dynamic_option/deleteDynamic',
								method : 'POST',
								params:{value:record.raw.text,parent:hasil},
								success : function(response) {
									var r = ajaxSuccess(response);
									$this.refresh();
								},
								failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
							});
						}
					});
				}
			}
		];
		this.callParent(arguments);
	}
})