'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAdoption } from '@/db/clientTurso';
import { useForm } from 'react-hook-form';
import { string, z } from 'zod';
import { TursoData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
  images: z.array(z.string()).optional()
});

export default function Home() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const [, setSelectedAge] = useState('');
  const [, setSelectedType] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, age, type, size } = values;
    console.log(values);

    const adoptionData: TursoData = {
      name,
      description,
      age,
      type,
      size
    };

    try {
      const newAdoption = await insertAdoption(adoptionData);
      console.log('Adoption inserted successfully:', newAdoption);
      // Puedes realizar más acciones después de la inserción aquí
    } catch (error) {
      console.error('Error inserting adoption:', error);
      // Puedes manejar el error de alguna manera aquí
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const files = Array.from(e.target.files || []);
    setFileNames(files.map((file) => file.name));
    if (files.length > 0) {
      setFileNames(fileNames);
      field.onChange(fileNames);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-xl flex flex-col pt-40 mx-auto min-h-screen'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder='shadcn'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                  placeholder='shadcn'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                  <Select
                    onValueChange={(value) => {
                      setSelectedAge(value);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Edad' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='puppy'>Cachorro</SelectItem>
                      <SelectItem value='young'>Adulto joven</SelectItem>
                      <SelectItem value='adult'>Adulto</SelectItem>
                      <SelectItem value='senior'>Anciano</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                  <Select
                    onValueChange={(value) => {
                      setSelectedType(value);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Tipo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='dog'>Perro</SelectItem>
                      <SelectItem value='cat'>Gato</SelectItem>
                      <SelectItem value='other'>Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    multiple
                    onChange={(e) => handleFileChange(e, field)}
                    id='fileInput'
                  />
                </FormControl>
                <FormDescription>
                  Selecciona tus imágenes públicas.
                </FormDescription>
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
                  <Select
                    onValueChange={(value) => {
                      setSelectedType(value);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Tamaño' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>Pequeño</SelectItem>
                      <SelectItem value='medium'>Mediano</SelectItem>
                      <SelectItem value='big'>Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className='w-fit mx-auto'
          type='submit'
        >
          Añadir
        </Button>
      </form>
    </Form>
  );
}
