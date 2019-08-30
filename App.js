import {View as GraphicsView} from 'expo-graphics';
import ExpoTHREE, {THREE} from "expo-three";
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

export default class App extends Component {
    onContextCreate = async ({
                                 gl,
                                 canvas,
                                 width,
                                 height,
                                 scale: pixelRatio,
                             }) => {
        this.renderer = new ExpoTHREE.Renderer({
            gl,
            height,
            pixelRatio,
            width
        });
        this.renderer.setClearColor(0x00ffff);

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);
        this.scene = new THREE.Scene();
        this.scene.add(await this.ground());
        this.scene.add(await this.sky());
        
        this.scene.add(this.ambient);

    };

    onRender = delta => {
        this.renderer.render(this.scene, this.camera);
    };

    render() {
        return (
            <View style={styles.container}>
                <GraphicsView
                    onContextCreate={this.onContextCreate}
                    onRender={this.onRender}
                    style={styles.container}
                />
            </View>
        );
    }

    async ground() {
        const geometry = new THREE.PlaneGeometry(100, 100, 4);

        const texture = await ExpoTHREE.loadAsync(require('./assets/lava.jpg'));
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(16, 16);

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            flatShading: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = THREE.Math.degToRad(-90);
        mesh.position.y = -1.1;
        return mesh;
    }

    async sky() {
        const geometry = new THREE.SphereBufferGeometry(200, 16, 8, 0, 2 * Math.PI, 0, 0.6 * Math.PI);
        geometry.scale(-1, 1, 1);
        const sky = await ExpoTHREE.loadAsync(require('./assets/space.jpg'));
        const material = new THREE.MeshBasicMaterial({
            map: sky,
        });

        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    
    get ambient() {
        return new THREE.AmbientLight(0x666666);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
