<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Minify{
	protected $ci;
	public $css_tag = '<link href="%s" rel="stylesheet" type="text/css" />';
	public $js_tag = '<script src="%s"></script>',$html_tags = TRUE;
	public $compression_engine = array('css' => 'minify', 'js' => 'closurecompiler');
	public function __construct($config = array()){
		$this->ci =  & get_instance();
		$this->ci->load->library('minifier');
	}
	public function press($file){
		$return = array();
		$return = array_merge($return, $this->_concat_files($file, '.', ''));
		echo  $this->_output($return);
	}
	private function _output($files){
		$output = array();
		foreach ($files['name'] as $file){
			if (preg_match("/.js$/i", $file)) {$template  = $this->js_tag;
			}else{$template  = $this->css_tag;}
			$output[] = $this->html_tags ? sprintf($template, base_url($file).$files['version'][$file]) : base_url($file).$files['version'][$file];
		}
		if ( ! empty($output)){return $this->html_tags ? implode(PHP_EOL, $output) : $output;}
		return $this->html_tags ? '' : array();
	}
	
	private function _concat_files($file_array, $directory, $out_file){
		$minifier=$this->ci->minifier;
		$nameArr=array();
		$versionArr=array();
		foreach ($file_array as $file_name){
			$value=$file_name;
			$version='';
			if (preg_match("/.js$/i", $file_name)) {
				if ( ! preg_match("/\.min\.js$/", $value)){$value = str_replace('.js', '.min.js', $value);}
			}else{
				if ( ! preg_match("/\.min\.css$/", $value)){$value = str_replace('.css', '.min.css', $value);}
			}
			if(! preg_match("/\.min\.css$/", $file_name) && ! preg_match("/\.min\.js$/", $file_name)){
				$timeFile=date('U', filemtime($file_name));
				$timeValue=date('U',time($value));
				if(file_exists($value)){
					$timeValue=date('U', filemtime($value));
				}
				if($timeFile!==$timeValue){
					if ($fh = fopen($value, 'w')){
						$contents  = file_get_contents($file_name);
						if (preg_match("/.js$/i", $file_name)) {
							// $contents = $minifier->minify($contents);
							$contents = $this->minifyJavascript($contents);
						}else{
							$contents = $this->minify_css($contents);
						}
						fwrite($fh,$contents);
						fclose($fh);
						touch($value,date('U', filemtime($file_name)),date('U', filemtime($file_name)));
					}else{throw new Exception('Can\'t write to ' . $value);}
				}
				$version='?v='.$timeFile;
			}
			$nameArr[]=$value;
			$versionArr[$value]=$version;
		}
		return array('name'=>$nameArr,'version'=>$versionArr);
	}
	// function minify_css($input) {
		// if(trim($input) === "") return $input;
		// $input = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $input); // negative look ahead
		// $input = preg_replace('/\s{2,}/', ' ', $input);
		// $input = preg_replace('/\s*([:;{}])\s*/', '$1', $input);
		// $input = preg_replace('/;}/', '}', $input);
		// return $input;
	// }
	// CSS Minifier => http://ideone.com/Q5USEF + improvement(s)
function minify_css($input) {
    if(trim($input) === "") return $input;
    return preg_replace(
        array(
            // Remove comment(s)
            '#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')|\/\*(?!\!)(?>.*?\*\/)|^\s*|\s*$#s',
            // Remove unused white-space(s)
            '#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/))|\s*+;\s*+(})\s*+|\s*+([*$~^|]?+=|[{};,>~+]|\s*+-(?![0-9\.])|!important\b)\s*+|([[(:])\s++|\s++([])])|\s++(:)\s*+(?!(?>[^{}"\']++|"(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')*+{)|^\s++|\s++\z|(\s)\s+#si',
            // Replace `0(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)` with `0`
            '#(?<=[\s:])(0)(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)#si',
            // Replace `:0 0 0 0` with `:0`
            '#:(0\s+0|0\s+0\s+0\s+0)(?=[;\}]|\!important)#i',
            // Replace `background-position:0` with `background-position:0 0`
            '#(background-position):0(?=[;\}])#si',
            // Replace `0.6` with `.6`, but only when preceded by `:`, `,`, `-` or a white-space
            '#(?<=[\s:,\-])0+\.(\d+)#s',
            // Minify string value
            '#(\/\*(?>.*?\*\/))|(?<!content\:)([\'"])([a-z_][a-z0-9\-_]*?)\2(?=[\s\{\}\];,])#si',
            '#(\/\*(?>.*?\*\/))|(\burl\()([\'"])([^\s]+?)\3(\))#si',
            // Minify HEX color code
            '#(?<=[\s:,\-]\#)([a-f0-6]+)\1([a-f0-6]+)\2([a-f0-6]+)\3#i',
            // Replace `(border|outline):none` with `(border|outline):0`
            '#(?<=[\{;])(border|outline):none(?=[;\}\!])#',
            // Remove empty selector(s)
            '#(\/\*(?>.*?\*\/))|(^|[\{\}])(?:[^\s\{\}]+)\{\}#s'
        ),
        array(
            '$1',
            '$1$2$3$4$5$6$7',
            '$1',
            ':0',
            '$1:0 0',
            '.$1',
            '$1$3',
            '$1$2$4$5',
            '$1$2$3',
            '$1:0',
            '$1$2'
        ),
    $input);
}
	function minifyJavascript($input){
		if(trim($input) === "") return $input;
		return preg_replace(
			array(
				// Remove comment(s)
				'#\s*("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')\s*|\s*\/\*(?!\!|@cc_on)(?>[\s\S]*?\*\/)\s*|\s*(?<![\:\=])\/\/.*(?=[\n\r]|$)|^\s*|\s*$#',
				// Remove white-space(s) outside the string and regex
				'#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/)|\/(?!\/)[^\n\r]*?\/(?=[\s.,;]|[gimuy]|$))|\s*([!%&*\(\)\-=+\[\]\{\}|;:,.<>?\/])\s*#s',
				// Remove the last semicolon
				'#;+\}#',
				// Minify object attribute(s) except JSON attribute(s). From `{'foo':'bar'}` to `{foo:'bar'}`
				'#([\{,])([\'])(\d+|[a-z_][a-z0-9_]*)\2(?=\:)#i',
				// --ibid. From `foo['bar']` to `foo.bar`
				'#([a-z0-9_\)\]])\[([\'"])([a-z_][a-z0-9_]*)\2\]#i'
			),
			array(
				'$1',
				'$1$2',
				'}',
				'$1$3',
				'$1.$3'
			),
		$input);
	}
}