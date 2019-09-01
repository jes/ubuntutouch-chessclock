import QtQuick 2.9
import QtQuick.Layouts 1.3
import QtQuick.Controls 2.2
import Ubuntu.Components 1.3 as Ubuntu
import Morph.Web 0.1
import QtWebEngine 1.7
import QtSystemInfo 5.5

ApplicationWindow {
    width: 1024
    height: 750
    visible:true

    ScreenSaver {
        screenSaverEnabled: !Qt.application.active
    }

    WebEngineView {
        anchors.fill: parent
        url: "../www/index.html"
    }
}
