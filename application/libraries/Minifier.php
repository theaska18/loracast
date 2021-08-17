<?php
 if (! defined ( 'BASEPATH' ))exit ( 'No direct script access allowed' );
class Minifier{
    protected $input;
    protected $index = 0;
    protected $a = '';
    protected $b = '';
    protected $c;
    protected $options;
    protected static $defaultOptions = array('flaggedComments' => true);
    protected $locks = array();
    public static function minify($js, $options = array()){
        try {
            ob_start();
            $jshrink = new Minifier();
            $js = $jshrink->lock($js);
            $jshrink->minifyDirectToOutput($js, $options);
            $js = ltrim(ob_get_clean());
            $js = $jshrink->unlock($js);
            unset($jshrink);
            return $js;
        } catch (\Exception $e) {
            if (isset($jshrink)) {$jshrink->clean();unset($jshrink);}
            ob_end_clean();
            throw $e;
        }
    }
    protected function minifyDirectToOutput($js, $options){$this->initialize($js, $options);$this->loop();$this->clean();}
    protected function initialize($js, $options){
        $this->options = array_merge(static::$defaultOptions, $options);
        $js = str_replace("\r\n", "\n", $js);
        $js = str_replace('/**/', '', $js);
        $this->input = str_replace("\r", "\n", $js);
        $this->input .= PHP_EOL;
        $this->a = "\n";
        $this->b = $this->getReal();
    }
    protected function loop(){
        while ($this->a !== false && !is_null($this->a) && $this->a !== '') {
            switch ($this->a) {
                case "\n":
                    if (strpos('(-+{[@', $this->b) !== false) {echo $this->a;$this->saveString();break;}
                    if($this->b === ' '){break;}
                case ' ':
                    if(static::isAlphaNumeric($this->b)){echo $this->a;}$this->saveString();break;
                default:
                    switch ($this->b) {
                        case "\n":
                            if (strpos('}])+-"\'', $this->a) !== false) {echo $this->a;$this->saveString();break;
                            } else {if (static::isAlphaNumeric($this->a)) {echo $this->a;$this->saveString();}}
                            break;
                        case ' ':
                            if(!static::isAlphaNumeric($this->a)){break;}
                        default:
                            if ($this->a === '/' && ($this->b === '\'' || $this->b === '"')) {$this->saveRegex();continue;}
                            echo $this->a;
                            $this->saveString();
                            break;
                    }
            }
            $this->b = $this->getReal();
            if(($this->b == '/' && strpos('(,=:[!&|?', $this->a) !== false)){$this->saveRegex();}
        }
    }
    protected function clean(){
        unset($this->input);
        $this->index = 0;
        $this->a = $this->b = '';
        unset($this->c);
        unset($this->options);
    }
    protected function getChar(){
        if (isset($this->c)) {$char = $this->c;unset($this->c);
        } else {
            $char = substr($this->input, $this->index, 1);
            if (isset($char) && $char === false) {return false;}
            $this->index++;
        }
        if($char !== "\n" && ord($char) < 32){return ' ';}
        return $char;
    }
    protected function getReal(){
        $startIndex = $this->index;
        $char = $this->getChar();
        if ($char !== '/') {return $char;}
        $this->c = $this->getChar();
        if ($this->c === '/') {return $this->processOneLineComments($startIndex);
        } elseif ($this->c === '*') {return $this->processMultiLineComments($startIndex);}
        return $char;
    }
    protected function processOneLineComments($startIndex){
        $thirdCommentString = substr($this->input, $this->index, 1);
        $this->getNext("\n");
        if ($thirdCommentString == '@') {
            $endPoint = $this->index - $startIndex;
            unset($this->c);
            $char = "\n" . substr($this->input, $startIndex, $endPoint);
        } else {$this->getChar();$char = $this->getChar();}
        return $char;
    }
    protected function processMultiLineComments($startIndex){
        $this->getChar();
        $thirdCommentString = $this->getChar();
        if ($this->getNext('*/')) {
            $this->getChar();
            $this->getChar();
            $char = $this->getChar();
            if (($this->options['flaggedComments'] && $thirdCommentString === '!') || ($thirdCommentString === '@') ) {
                if ($startIndex > 0) {
                    echo $this->a;
                    $this->a = " ";
                    if ($this->input[($startIndex - 1)] === "\n") {echo "\n";}
                }
                $endPoint = ($this->index - 1) - $startIndex;
                echo substr($this->input, $startIndex, $endPoint);
                return $char;
            }
        } else {$char = false;}
        if($char === false){throw new \RuntimeException('Unclosed multiline comment at position: ' . ($this->index - 2));}
        if(isset($this->c)){unset($this->c);}
        return $char;
    }
    protected function getNext($string){
        $pos = strpos($this->input, $string, $this->index);
        if($pos === false){return false;}
        $this->index = $pos;
        return substr($this->input, $this->index, 1);
    }
    protected function saveString(){
        $startpos = $this->index;
        $this->a = $this->b;
        if ($this->a !== "'" && $this->a !== '"') {return;}
        $stringType = $this->a;
        echo $this->a;
        while (true) {
            $this->a = $this->getChar();
            switch ($this->a) {
                case $stringType:
                    break 2;
                case "\n":throw new \RuntimeException('Unclosed string at position: ' . $startpos );break;
                case '\\':
					$this->b = $this->getChar();
                    if ($this->b === "\n") {break;}
                    echo $this->a . $this->b;
                    break;
                default:echo $this->a;
            }
        }
    }
    protected function saveRegex(){
        echo $this->a . $this->b;
        while (($this->a = $this->getChar()) !== false) {
            if($this->a === '/'){break;}
            if ($this->a === '\\') {echo $this->a;$this->a = $this->getChar();}
            if($this->a === "\n"){throw new \RuntimeException('Unclosed regex pattern at position: ' . $this->index);}
            echo $this->a;
        }
        $this->b = $this->getReal();
    }
    protected static function isAlphaNumeric($char){return preg_match('/^[\w\$\pL]$/', $char) === 1 || $char == '/';}
    protected function lock($js){
        $lock = '"LOCK---' . crc32(time()) . '"';
        $matches = array();
        preg_match('/([+-])(\s+)([+-])/S', $js, $matches);
        if (empty($matches)) {return $js;}
        $this->locks[$lock] = $matches[2];
        $js = preg_replace('/([+-])\s+([+-])/S', "$1{$lock}$2", $js);
        return $js;
    }
    protected function unlock($js){
        if (empty($this->locks)) {return $js;}
        foreach ($this->locks as $lock => $replacement) {$js = str_replace($lock, $replacement, $js);}
        return $js;
    }
}