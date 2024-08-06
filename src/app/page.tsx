'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TursoData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  age: z.enum(['puppy', 'young', 'adult', 'senior']),
  type: z.enum(['dog', 'cat', 'other']),
  size: z.enum(['small', 'medium', 'big']),
  photos: z.array(z.string()).optional()
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      age: undefined,
      type: undefined,
      size: undefined,
      photos: []
    }
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log(data);

    return { url: data.url };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Activar el indicador de carga

    const { name, description, age, type, size } = values;

    // Subir las imágenes y obtener tanto la URL como el `imageId`
    const photoData = await Promise.all(
      selectedFiles.map(async (file) => {
        const { url } = await uploadToCloudinary(file);
        return { url };
      })
    );
    const photoUrls = photoData.map((data) => data.url);
    const adoptionData: TursoData = {
      name,
      description,
      age,
      type,
      size,
      photos: photoUrls.length ? photoUrls : []
    };

    try {
      const response = await fetch('/api/adoption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adoptionData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Adoption inserted successfully:', result);
        alert('Formulario enviado correctamente');
        form.reset({
          name: '',
          description: '',
          age: undefined,
          type: undefined,
          size: undefined,
          photos: []
        });
        setSelectedFiles([]);
        window.location.reload();
      } else {
        console.error('Error inserting adoption:', result.error);
      }
    } catch (error) {
      console.error('Error inserting adoption:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-xl flex flex-col pt-14 mx-auto min-h-screen'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder='Introduce un nombre ...'
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Cuenta su historia ...'
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='age'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className='w-[200px]'>
                      <SelectValue placeholder='Selecciona una edad' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='puppy'>Cachorro</SelectItem>
                      <SelectItem value='young'>Adulto joven</SelectItem>
                      <SelectItem value='adult'>Adulto</SelectItem>
                      <SelectItem value='senior'>Anciano</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className='w-[200px]'>
                      <SelectValue placeholder='Elige un animal' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='dog'>Perro</SelectItem>
                      <SelectItem value='cat'>Gato</SelectItem>
                      <SelectItem value='other'>Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='photos'
            render={() => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    multiple
                    onChange={handleFileChange}
                    id='fileInput'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='size'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamaño</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className='w-[200px]'>
                      <SelectValue placeholder='Selecciona un tamaño' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>Pequeño</SelectItem>
                      <SelectItem value='medium'>Mediano</SelectItem>
                      <SelectItem value='big'>Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className='w-fit mx-auto'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Añadir'}
          {/* Cambiar el texto del botón */}
        </Button>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50'>
            {/* Indicador de carga */}
          </div>
        )}
      </form>
    </Form>
  );
}
