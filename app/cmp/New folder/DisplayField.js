Ext.define('App.cmp.DisplayField',{
	extend: 'Ext.form.DisplayField',
	property:{},
	press:{},
	event:{},
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='displayfield';
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+'</span>';		
		}
		this.callParent(arguments);
	}
});