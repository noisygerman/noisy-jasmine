module.exports = function startTddWatchLoop(){

  function byPathFilter(){

    const regx = /^(spec|lib)[^$.]*($|\.js$)/;

    return regx.test.bind( regx );

  }

  const watchOptions = {
    ignoreDotFiles:      true,
    filter:              byPathFilter(),
    ignoreUnreadableDir: true,
    ignoreNotPermitted:  true
  };

  require( 'watch' ).createMonitor( './', watchOptions, ( monitor )=> {

    function onChanged(){

      monitor.removeListener( 'changed', onChanged );
      monitor.removeListener( 'removed', onChanged );
      monitor.removeListener( 'created', onChanged );

      require( 'child_process' )
        .fork( './utils/lint-and-test.js' )
        .on( 'close', ()=> {

          monitor.on( 'changed', onChanged );
          monitor.on( 'removed', onChanged );
          monitor.on( 'created', onChanged );

        } );

    }

    monitor.once( 'changed', onChanged );

  } );

};
