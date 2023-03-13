import { ChangeEvent, createRef, useState } from 'react';

import { AppLayout, Box, Button, Container, Form, FormField, Grid, Header, Icon, SpaceBetween } from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';

import ResultArea from './images/result_area.png';

const lambdaUrl = 'https://?????.lambda-url.ap-northeast-1.on.aws/'


navigator.serviceWorker.register('/sw.js')
  .then(function (registration) {
    registration.update()
  });


function notification(message: string) {
  if (Notification) {
    Notification.requestPermission((result) => {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage(message);
        });
      } else {
        alert(message)
      }
    });
  } else {
    alert(message)
  }
}

export default function Page() {

  const [file, setFile] = useState<null | File>(null)
  const [thumbnail, setThumbnail] = useState('')
  const [imageSrc, setImageSrc] = useState(ResultArea)
  const [submitting, setSubmitting] = useState(false)

  const fileInput = createRef<HTMLInputElement>();

  const fileSelect = function () {
    fileInput.current?.click()
  }

  const fileSelectChange = function (e: ChangeEvent<HTMLInputElement>) {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const selectFile: File = e.target.files[0]
      setFile(selectFile)

      const reader = new FileReader()
      reader.onload = (e: any) => {
        setThumbnail(e.target.result)
      }
      reader.readAsDataURL(selectFile)
    }
  }

  const submit = function () {
    if (file) {
      setSubmitting(true)
      notification('処理を開始します。完了したらお知らせします（10分以上かかることもあります）')
      fetch(lambdaUrl, {
        method: 'POST',
        body: file
      }).then(response => {
        setSubmitting(false)
        if (!response.ok) {
          throw new Error(response.status + ' : Network response was not OK');
        }
        return response.blob()
      }).then(data => {
        setImageSrc(URL.createObjectURL(data))
        notification('完了しました。')
      }).catch((error) => {
        notification('エラーが発生しました。\n' + error)
        setSubmitting(false)
      });
    } else {
      alert('ファイルを選択してね')
    }
  }


  return (
    <AppLayout
      navigationHide={true}
      toolsHide={true}
      content=<div>
        <Header
          variant='h1'
          description=<SpaceBetween size='xxs' direction='vertical'>
            <Box>cartoon, by Makoto Shinkai</Box>
          </SpaceBetween>
        >Stable Diffusion</Header>

        <SpaceBetween size='xs' direction='vertical'>
          <Grid gridDefinition={[{ colspan: { default: 12, xs: 4 } }, { colspan: { default: 12, xs: 8 } }]}>
            <Container>
              <form>
                <Form
                  actions=<SpaceBetween direction="horizontal" size="xs">
                    <Button formAction='none' variant="normal" iconName='status-negative' onClick={e => setSubmitting(false)}>キャンセル</Button>
                    <Button formAction='none' variant="primary" iconName='upload' onClick={submit} loading={submitting}>送信</Button>
                  </SpaceBetween>
                >
                  <SpaceBetween direction='vertical' size='xs'>

                    <FormField
                      label="ファイル選択"
                      description="写真を選択してください。"
                    >
                      <input type='file' accept='image/*' style={{ display: 'none' }} ref={fileInput} onChange={fileSelectChange}></input>
                    </FormField>

                    <Button iconName='upload' formAction='none' onClick={fileSelect}>Choose file</Button>

                    <div style={{ display: file ? 'inherit' : 'none' }}>
                      <Grid gridDefinition={[{ colspan: { default: 4 } }, { colspan: { default: 8 } }]}>
                        <img alt='thumbnail' src={thumbnail} style={{ maxWidth: '100px' }}></img>
                        <SpaceBetween size='xxs'>
                          <span style={{ display: 'flex', gap: '2px' }}>
                            <Icon name='status-positive' variant='success'></Icon>
                            <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{file?.name}</div>
                          </span>
                          <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{`${file?.size} Byte`}</div>
                        </SpaceBetween>
                      </Grid>
                    </div>

                  </SpaceBetween>
                </Form>
              </form>

            </Container>
            <Container>
              <Box textAlign='center'>
                <a href={imageSrc} download={true}>
                  <img alt='result' src={imageSrc} style={{ maxWidth: '100%' }}></img>
                </a>
              </Box>

            </Container>
          </Grid>
        </SpaceBetween>

      </div>

    />
  )
}
