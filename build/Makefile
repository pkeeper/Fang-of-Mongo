jsslug = js
soyslug = templates

projectdir = /home/knut/devel/django/Fang-of-Mongo/fangofmongo/static/src
closurelibdir = $(projectdir)/../js/goog
soylibdir = $(projectdir)/../js/soy
jstpldir = $(projectdir)/$(jsslug)/templates
soysrcdir = $(projectdir)/$(soyslug)
jssrcdir = $(projectdir)/$(jsslug)
outputdir = $(projectdir)

hookinfile = $(projectdir)/$(jsslug)/mangoadmin.js

out_deps = $(outputdir)/deps.js
out_concated = $(outputdir)/app.cat.js
out_minified = $(outputdir)/app.min.js
out_compiled = $(outputdir)/app.com.js

CALCDEPS = tools/calcdeps.py
COMPILERJAR = tools/compiler.jar
SOYJAR = tools/SoyToJsSrcCompiler.jar

all: templates deps

${jstpldir}:
	@@mkdir -p ${jstpldir}

templates: ${SOYJAR} | ${jstpldir}
	find ${soysrcdir} -type f -name '*.soy' | xargs java -jar ${SOYJAR} \
	--outputPathFormat "${jstpldir}/{INPUT_FILE_NAME_NO_EXT}.js" \
	--codeStyle concat \
	--shouldGenerateJsdoc \
	--shouldProvideRequireSoyNamespaces

deps: ${CALCDEPS} ${hookinfile} ${closurelibdir} ${soylibdir} ${jssrcdir} templates
	python ${CALCDEPS} \
	--dep ${closurelibdir} \
	--path ${soylibdir} \
	--path ${jssrcdir} \
	--input ${hookinfile} \
	--output_mode deps \
	> ${out_deps}

compile: ${CALCDEPS} ${COMPILERJAR} ${hookinfile} ${closurelibdir} ${soylibdir} ${jssrcdir} templates
	python ${CALCDEPS} \
	--path ${closurelibdir} \
	--path ${soylibdir} \
	--path ${jssrcdir} \
	--input ${hookinfile} \
	--compiler_jar ${COMPILERJAR} \
	--output_mode compiled \
	--compiler_flags="--output_wrapper=\"(function(){%output%})();\"" \
	--compiler_flags="--js=${closurelibdir}/deps.js" \
	--compiler_flags="--define=goog.DEBUG=false" \
	--compiler_flags="--define=goog.userAgent.ASSUME_WEBKIT=true" \
	--compiler_flags="--define=goog.userAgent.ASSUME_LINUX=true" \
	--compiler_flags="--define=goog.userAgent.ASSUME_X11=true" \
	--compiler_flags="--define=goog.userAgent.jscript.ASSUME_NO_JSCRIPT=true" \
	--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
	--compiler_flags="--jscomp_error=accessControls" \
	--compiler_flags="--jscomp_error=ambiguousFunctionDecl" \
	--compiler_flags="--jscomp_error=checkTypes" \
	--compiler_flags="--jscomp_error=checkVars" \
	--compiler_flags="--jscomp_error=constantProperty" \
	--compiler_flags="--jscomp_error=deprecated" \
	--compiler_flags="--jscomp_error=globalThis" \
	--compiler_flags="--jscomp_error=internetExplorerChecks" \
	--compiler_flags="--jscomp_error=invalidCasts" \
	--compiler_flags="--jscomp_error=strictModuleDepCheck" \
	--compiler_flags="--jscomp_error=unknownDefines" \
	--compiler_flags="--jscomp_warning=visibility" \
	--compiler_flags="--warning_level=VERBOSE" \
	> ${out_compiled}

.PHONY: templates compile deps all