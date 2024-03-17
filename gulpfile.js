const gulp = require('gulp');
const {scssBundler,svgBundler,jsBundler} = require('gulp2go');

const replace = require('gulp-string-replace');
const favicons = require("favicons");

gulp.task('favicon', function(){
    const color = '#202020';
    const iconFile = '_assets/favicon.svg';
    const iconPath = 'dist/favicon';
    const appName  = 'Alla Romasheva';
    const appShortName = 'Alla Romasheva'
    const url = 'https://romasheva.com/';
    const filePath = url.concat(iconPath);
    return gulp.src(iconFile)
        .pipe(replace('currentColor',color))
        .pipe(favicons.stream({
            appName: appName,
            appShortName: appShortName,
            appDescription: "",
            background: color ,
            path: filePath,
            theme_color: color,
            appleStatusBarStyle: 'default',
            url: url,
            display: "standalone",
            orientation: "portrait",
            scope: "/",
            start_url: "/?homescreen=1",
            version: 1.0,
            replace: true,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: true,
                favicons: true,
                firefox: false,
                windows: true,
                yandex: false
            }
        },(html)=>{
            console.log(html.join('\n'));
        }))
        .pipe(gulp.dest(iconPath));
});

gulp.task('images', function(){
    return gulp.src('_assets/images/**.*').pipe(gulp.dest('dist/images'))
});

gulp.task('sprite', () => {
    return svgBundler('_assets/icons/**/*.svg', 'sprite.svg', 'dist');
});

gulp.task('scss', () => {
    return scssBundler('_assets/scss/*.scss', 'dist');
});

gulp.task('js', function(){
    return jsBundler('_assets/src/index.js','index.js','dist',{
        babelify:{

        },
        schemify:{
            "jquery": "$"
        }
    });
});

gulp.task('watch', function(){
    gulp.watch(['_assets/scss/**/*.scss'], gulp.series(['scss']));
    gulp.watch(['_assets/build.js','_assets/src/**/*.js'], gulp.series(['js']));
});

gulp.task('default', gulp.series(['scss','sprite','js','images']));
